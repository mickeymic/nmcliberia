<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit();
}

// Set content type to JSON
header('Content-Type: application/json');

try {
    // Get the content file path
    $contentFile = '../content.json';
    
    // Read existing content
    $existingContent = [];
    if (file_exists($contentFile)) {
        $jsonContent = file_get_contents($contentFile);
        if ($jsonContent !== false) {
            $existingContent = json_decode($jsonContent, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                $existingContent = [];
            }
        }
    }
    
    // Prepare new content structure
    $newContent = [];
    
    // Process top header
    if (isset($_POST['topHeader'])) {
        $newContent['topHeader'] = [
            'welcomeText' => $_POST['topHeader']['welcomeText'] ?? ''
        ];
    } else {
        $newContent['topHeader'] = $existingContent['topHeader'] ?? ['welcomeText' => ''];
    }
    
    // Process main header and navigation
    if (isset($_POST['mainHeader']['navigation'])) {
        $navigation = [];
        foreach ($_POST['mainHeader']['navigation'] as $item) {
            if (!empty($item['label'])) {
                $navigation[] = [
                    'label' => $item['label'] ?? '',
                    'link' => $item['link'] ?? '#'
                ];
            }
        }
        $newContent['mainHeader'] = [
            'logoText' => 'NMCL',
            'navigation' => $navigation
        ];
    } else {
        $newContent['mainHeader'] = $existingContent['mainHeader'] ?? [
            'logoText' => 'NMCL',
            'navigation' => []
        ];
    }
    
    // Process news ticker
    if (isset($_POST['newsTicker'])) {
        $newsTicker = [];
        foreach ($_POST['newsTicker'] as $item) {
            if (!empty(trim($item))) {
                $newsTicker[] = trim($item);
            }
        }
        $newContent['newsTicker'] = $newsTicker;
    } else {
        $newContent['newsTicker'] = $existingContent['newsTicker'] ?? [];
    }
    
    // Process hero slides
    if (isset($_POST['heroSlides'])) {
        $heroSlides = [];
        foreach ($_POST['heroSlides'] as $slide) {
            if (!empty($slide['title'])) {
                $heroSlides[] = [
                    'title' => $slide['title'] ?? '',
                    'description' => $slide['description'] ?? '',
                    'image' => $slide['image'] ?? '',
                    'buttonText' => $slide['buttonText'] ?? 'Find Out More',
                    'buttonLink' => $slide['buttonLink'] ?? '#'
                ];
            }
        }
        $newContent['heroSlides'] = $heroSlides;
    } else {
        $newContent['heroSlides'] = $existingContent['heroSlides'] ?? [];
    }
    
    // Process about section
    if (isset($_POST['about'])) {
        $newContent['about'] = [
            'title' => $_POST['about']['title'] ?? 'About NMCL',
            'content' => $_POST['about']['content'] ?? ''
        ];
    } else {
        $newContent['about'] = $existingContent['about'] ?? [
            'title' => 'About NMCL',
            'content' => ''
        ];
    }
    
    // Process mission section
    if (isset($_POST['mission'])) {
        $newContent['mission'] = [
            'title' => 'Our Mission',
            'content' => $_POST['mission']['content'] ?? ''
        ];
    } else {
        $newContent['mission'] = $existingContent['mission'] ?? [
            'title' => 'Our Mission',
            'content' => ''
        ];
    }
    
    // Process vision section
    if (isset($_POST['vision'])) {
        $newContent['vision'] = [
            'title' => 'Our Vision',
            'content' => $_POST['vision']['content'] ?? ''
        ];
    } else {
        $newContent['vision'] = $existingContent['vision'] ?? [
            'title' => 'Our Vision',
            'content' => ''
        ];
    }
    
    // Process contact information
    if (isset($_POST['contact'])) {
        $newContent['contact'] = [
            'address' => $_POST['contact']['address'] ?? '',
            'phone' => $_POST['contact']['phone'] ?? '',
            'email' => $_POST['contact']['email'] ?? ''
        ];
    } else {
        $newContent['contact'] = $existingContent['contact'] ?? [
            'address' => '',
            'phone' => '',
            'email' => ''
        ];
    }
    
    // Process footer
    if (isset($_POST['footer'])) {
        $newContent['footer'] = [
            'text' => $_POST['footer']['text'] ?? '© 2026 National Muslim Council of Liberia. All rights reserved.'
        ];
    } else {
        $newContent['footer'] = $existingContent['footer'] ?? [
            'text' => '© 2026 National Muslim Council of Liberia. All rights reserved.'
        ];
    }
    
    // Create backup of existing content
    $backupFile = '../content-backup-' . date('Y-m-d-H-i-s') . '.json';
    if (file_exists($contentFile) && !copy($contentFile, $backupFile)) {
        error_log("Failed to create backup of content.json");
    }
    
    // Save new content to JSON file
    $jsonOutput = json_encode($newContent, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    
    if (file_put_contents($contentFile, $jsonOutput) !== false) {
        // Set proper file permissions
        chmod($contentFile, 0644);
        
        echo json_encode([
            'success' => true,
            'message' => 'Content saved successfully',
            'backup' => basename($backupFile)
        ]);
    } else {
        throw new Exception('Failed to write to content file');
    }
    
} catch (Exception $e) {
    // Log the error
    error_log('Content save error: ' . $e->getMessage());
    
    echo json_encode([
        'success' => false,
        'message' => 'Error saving content: ' . $e->getMessage()
    ]);
}
?>