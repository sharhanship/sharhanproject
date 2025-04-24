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
    
    // مدیریت درخواست POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (isset($data['action']) && $data['action'] === 'add_skill') {
            // اعتبارسنجی داده‌ها
            if (empty($data['name']) || !isset($data['percent'])) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'نام و درصد مهارت الزامی است']);
                exit;
            }
            
            $stmt = $conn->prepare("INSERT INTO coding_skills (skill_name, skill_percentage) VALUES (?, ?)");
            $stmt->execute([$data['name'], $data['percent']]);
            
            echo json_encode([
                'status' => 'success',
                'id' => $conn->lastInsertId(),
                'message' => 'مهارت با موفقیت اضافه شد'
            ]);
            exit;
        }

        if (isset($_POST['action']) && $_POST['action'] === 'delete_skill') {
            if (empty($_POST['id'])) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'شناسه مهارت الزامی است']);
                exit;
            }

            $stmt = $conn->prepare("DELETE FROM coding_skills WHERE id = ?");
            $stmt->execute([$_POST['id']]);

            echo json_encode([
                'status' => 'success',
                'message' => 'مهارت با موفقیت حذف شد'
            ]);
            exit;
        }
    }
    
    // مدیریت درخواست GET
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (isset($_GET['action']) && $_GET['action'] === 'get_skills') {
            $stmt = $conn->prepare("SELECT id, skill_name, skill_percentage FROM coding_skills");
            $stmt->execute();
            $skills = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'status' => 'success',
                'data' => $skills
            ]);
            exit;
        }
    }
    
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'درخواست نامعتبر']);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'خطای پایگاه داده: ' . $e->getMessage()
    ]);
}
