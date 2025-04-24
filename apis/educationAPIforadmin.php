<?php
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = 'localhost';
$dbname = 'alisharhan-db';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // مدیریت درخواست‌های POST برای افزودن یا حذف تجربه
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['action']) && $_POST['action'] === 'delete_experience') {
            if (empty($_POST['id'])) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'شناسه تجربه الزامی است']);
                exit;
            }

            $stmt = $conn->prepare("DELETE FROM education_section WHERE id = ?");
            $stmt->execute([$_POST['id']]);

            echo json_encode([
                'status' => 'success',
                'message' => 'تجربه با موفقیت حذف شد'
            ]);
            exit;
        }

        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (isset($data['action']) && $data['action'] === 'add_experience') {
            if (empty($data['year']) || empty($data['title']) || empty($data['description'])) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'تمام فیلدها الزامی هستند']);
                exit;
            }

            $stmt = $conn->prepare("INSERT INTO education_section (year, title, description) VALUES (?, ?, ?)");
            $stmt->execute([$data['year'], $data['title'], $data['description']]);

            echo json_encode([
                'status' => 'success',
                'message' => 'تجربه با موفقیت اضافه شد'
            ]);
            exit;
        }
    }

    // مدیریت درخواست‌های GET برای بارگذاری تجربه‌ها
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $conn->prepare("SELECT id, year, title, description FROM education_section");
        $stmt->execute();
        $experiences = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['status' => 'success', 'data' => $experiences]);
        exit;
    }

    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'درخواست نامعتبر']);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'خطای پایگاه داده: ' . $e->getMessage()
    ]);
}
