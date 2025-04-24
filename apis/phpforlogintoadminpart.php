<?php
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'alisharhan-db';
$user = 'root'; 
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    
    // دریافت و اعتبارسنجی داده‌های ورودی
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';
    
    // اعتبارسنجی اولیه
    if (empty($username) || empty($password)) {
        throw new Exception('نام کاربری و رمز عبور الزامی است');
    }
    
    // جستجوی کاربر در دیتابیس با استفاده از prepared statement
    $stmt = $pdo->prepare("SELECT id, password FROM adminpartloginpart WHERE username = :username LIMIT 1");
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();
    $user = $stmt->fetch();
    
    if ($user && $password === $user['password']) {
        //اگر کاربر اصالت داشت و بی ارزش نبود
        // در محیط واقعی باید از password_verify() برای مقایسه رمزهای هش شده استفاده کنید
        $redirectUrl = generateSecureAdminUrl(); // تولید آدرس امن
        
        echo json_encode([
            'success' => true,
            'redirect' => $redirectUrl
        ]);
    } else {
        // کاربر نامعتبر است
        echo json_encode([
            'success' => false,
            'message' => 'نام کاربری یا رمز عبور اشتباه است'
        ]);
    }
    
} catch (PDOException $e) {
    // خطای دیتابیس
    error_log('Database error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'خطای سیستمی رخ داده است'
    ]);
} catch (Exception $e) {
    // سایر خطاها
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}


// تولید آدرس امن برای صفحه ادمین

function generateSecureAdminUrl() {
    $token = bin2hex(random_bytes(16)); // تولید توکن تصادفی
    $_SESSION['admin_token'] = $token; // ذخیره توکن در session
    
    // در اینجا می‌توانید منطق پیچیده‌تری برای تولید آدرس داشته باشید
    return "./security/controlcontent?token=" . $token; // آدرس واقعی پنل ادمین
}
?>