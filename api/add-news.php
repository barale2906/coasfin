<?php
// Configurar cabeceras para permitir solicitudes AJAX
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Obtener datos JSON del cuerpo de la solicitud
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validar datos
if (!$data || !isset($data['title']) || !isset($data['date']) || !isset($data['summary']) || !isset($data['content']) || !isset($data['author'])) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

// Ruta al archivo JSON
$jsonFile = '../data/news.json';

// Verificar si el archivo existe
if (!file_exists($jsonFile)) {
    echo json_encode(['success' => false, 'message' => 'Archivo de noticias no encontrado']);
    exit;
}

// Leer el archivo JSON actual
$currentNews = json_decode(file_get_contents($jsonFile), true);

// Generar un ID único
$newId = (string)time();

// Crear la nueva noticia
$newArticle = [
    'id' => $newId,
    'title' => $data['title'],
    'date' => $data['date'],
    'image' => $data['image'] ?? 'images/news/default-news.jpg',
    'summary' => $data['summary'],
    'content' => $data['content'],
    'author' => $data['author']
];

// Agregar la nueva noticia al principio del array
array_unshift($currentNews, $newArticle);

// Escribir el archivo JSON actualizado
if (file_put_contents($jsonFile, json_encode($currentNews, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => true, 'message' => 'Noticia agregada exitosamente', 'id' => $newId]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al guardar la noticia']);
}
?> 