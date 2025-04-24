<?php
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = 'localhost';
$dbname = 'alisharhan-db';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // مدیریت درخواست GET برای دریافت مهارت‌ها
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $conn->prepare("SELECT skill_name, skill_percentage FROM coding_skills");
        $stmt->execute();
        $skills = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'status' => 'success',
            'data' => $skills
        ]);
        exit;
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
?>