<?php
ob_start();

header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);
error_reporting(E_ALL);

function jsonResponse($status, $message, $data = []) {
    $response = [
        'status' => $status,
        'message' => $message,
        'data' => $data
    ];
    ob_end_clean();
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

function sanitizeInput($data) {
    return htmlspecialchars(trim(stripslashes($data)), ENT_QUOTES, 'UTF-8');
}

function isPersianName($name) {
    return preg_match('/^[\p{Arabic}\s\x{200C}]+$/u', $name);
}

function validateIranianPhone($phone) {
    $phone = preg_replace('/\D/', '', $phone);
    if (strlen($phone) !== 11) return false;
    
    $validPrefixes = [
        '0912','0913','0914','0915','0916','0917','0918','0919',
        '0902','0903','0904','0905','0941',
        '0921','0922','0923','0930','0931','0932','0933','0934',
        '0935','0936','0937','0938','0939',
        '0990','0991','0992','0993','0994',
        '021','026','031','044','045','061','024','025','028',
        '034','035','038','041','051','054','056','058','071',
        '074','077','081','084','086','087'
    ];
    
    return in_array(substr($phone, 0, 4), $validPrefixes);
}

try {
    $json = file_get_contents('php://input');
    if ($json === false) {
        jsonResponse('error', 'خطا در دریافت داده‌های ورودی');
    }
    
    $data = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        jsonResponse('error', 'فرمت JSON نامعتبر');
    }

    $inputs = [
        'name' => sanitizeInput($data['name'] ?? ''),
        'email' => sanitizeInput($data['email'] ?? ''),
        'phone' => sanitizeInput($data['phone'] ?? ''),
        'message' => sanitizeInput($data['message'] ?? '')
    ];

    $errors = [];
    
    if (empty($inputs['name'])) {
        $errors[] = 'نام الزامی است';
    } else {
        if (mb_strlen($inputs['name']) < 2) {
            $errors[] = 'نام باید حداقل ۲ کاراکتر داشته باشد';
        } elseif (!isPersianName($inputs['name'])) {
            $errors[] = 'نام باید فارسی باشد';
        }
    }

    if (empty($inputs['email'])) {
        $errors[] = 'ایمیل الزامی است';
    } elseif (!filter_var($inputs['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'ایمیل معتبر نیست';
    }

    if (empty($inputs['phone'])) {
        $errors[] = 'شماره تلفن الزامی است';
    } elseif (!validateIranianPhone($inputs['phone'])) {
        $errors[] = 'شماره تلفن معتبر نیست';
    }

    if (empty($inputs['message'])) {
        $errors[] = 'پیام الزامی است';
    }
    
    if (!empty($errors)) {
        jsonResponse('error', implode(' | ', $errors));
    }

    $pdo = new PDO(
        'mysql:host=localhost;dbname=alisharhan-db;charset=utf8mb4',
        'root',
        '',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    $nameCountStmt = $pdo->prepare("SELECT COUNT(*) as count FROM contacts WHERE nameandfamily = :name");
    $nameCountStmt->execute([':name' => $inputs['name']]);
    $nameCount = $nameCountStmt->fetch()['count'];

    if ($nameCount >= 3) {
        jsonResponse('error', 'تعداد درخواست‌های این نام زیاد است (بیش از ۳ بار)');
    }

    $emailCountStmt = $pdo->prepare("SELECT COUNT(*) as count FROM contacts WHERE email = :email");
    $emailCountStmt->execute([':email' => $inputs['email']]);
    $emailCount = $emailCountStmt->fetch()['count'];

    if ($emailCount >= 3) {
        jsonResponse('error', 'تعداد درخواست‌های این ایمیل زیاد است (بیش از ۳ بار)');
    }

    $phoneCountStmt = $pdo->prepare("SELECT COUNT(*) as count FROM contacts WHERE numberphone = :phone");
    $phoneCountStmt->execute([':phone' => $inputs['phone']]);
    $phoneCount = $phoneCountStmt->fetch()['count'];

    if ($phoneCount >= 3) {
        jsonResponse('error', 'تعداد درخواست‌های این شماره تلفن زیاد است (بیش از ۳ بار)');
    }

    $checkStmt = $pdo->prepare("SELECT id FROM contacts WHERE mortext = :message LIMIT 1");
    $checkStmt->execute([':message' => $inputs['message']]);

    if ($checkStmt->fetch()) {
        jsonResponse('error', 'این پیام قبلاً ثبت شده است');
    }

    $insertStmt = $pdo->prepare("INSERT INTO contacts 
                               (nameandfamily, email, numberphone, mortext) 
                               VALUES (:name, :email, :phone, :message)");
    
    $insertSuccess = $insertStmt->execute([
        ':name' => $inputs['name'],
        ':email' => $inputs['email'],
        ':phone' => $inputs['phone'],
        ':message' => $inputs['message']
    ]);

    if (!$insertSuccess) {
        jsonResponse('error', 'خطا در ثبت اطلاعات');
    }

    jsonResponse('success', 'پیام با موفقیت ثبت شد');

} catch (PDOException $e) {
    jsonResponse('error', 'خطای پایگاه داده: ' . $e->getMessage());
} catch (Exception $e) {
    jsonResponse('error', $e->getMessage());
}