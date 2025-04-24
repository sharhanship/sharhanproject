<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$dbname = 'alisharhan-db';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // دریافت داده‌های ارسالی
    $data = json_decode(file_get_contents('php://input'), true);
    $title = $data['title'] ?? '';
    $description = $data['description'] ?? '';
    
    // ابتدا رکوردهای موجود را حذف 
    $conn->exec("DELETE FROM about_section");
    
    //  رکورد جدید  اضافه می‌کنیم
    $stmt = $conn->prepare("INSERT INTO about_section (title, description) VALUES (:title, :description)");
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->execute();
    
    echo json_encode(['status' => 'success']);
    
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

// اعتبارسنجی داده‌های ورودی
if(empty($title) || empty($description)) {
    echo json_encode(['status' => 'error', 'message' => 'عنوان و توضیحات نمی‌توانند خالی باشند']);
    exit;
}

if(strlen($title) > 100) {
    echo json_encode(['status' => 'error', 'message' => 'عنوان نمی‌تواند بیش از 100 کاراکتر باشد']);
    exit;
}
?>