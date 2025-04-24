<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$dbname = 'alisharhan-db';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // تشخیص نوع درخواست
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // دریافت لیست پیام‌ها
        $stmt = $conn->prepare("SELECT * FROM contacts ORDER BY id DESC");
        $stmt->execute();
        $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'status' => 'success',
            'data' => array_map(function($contact) {
                return [
                    'id' => $contact['id'],
                    'nameandfamily' => $contact['nameandfamily'],
                    'email' => $contact['email'],
                    'numberphone' => $contact['numberphone'],
                    'mortext' => $contact['mortext']
                ];
            }, $contacts)
        ]);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
        // حذف پیام
        $id = $_POST['id'];
        $stmt = $conn->prepare("DELETE FROM contacts WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        echo json_encode(['status' => 'success']);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>