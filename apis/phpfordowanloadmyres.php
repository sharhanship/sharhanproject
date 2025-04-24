<?php
$file_path = $_SERVER['DOCUMENT_ROOT'] . '/alisharhan/import/AlisharhanResume.pdf';

if (!file_exists($file_path)) {
    die("فایل یافت نشد!");
}

header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="AlisharhanResume.pdf"'); 
header('Content-Length: ' . filesize($file_path));

readfile($file_path);
exit;
?>