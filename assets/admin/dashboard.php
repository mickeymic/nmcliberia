<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit();
}

// Read current content
$contentFile = '../content.json';
$content = [];
if (file_exists($contentFile)) {
    $content = json_decode(file_get_contents($contentFile), true);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NMCL Admin Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .dashboard-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .dashboard-header {
            background: linear-gradient(135deg, #009900 0%, #007700 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .dashboard-header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .dashboard-header p {
            opacity: 0.9;
            font-size: 1.1rem;
        }

        .dashboard-nav {
            background: #f8f9fa;
            padding: 20px 30px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-links {
            display: flex;
            gap: 20px;
        }

        .nav-links a {
            color: #495057;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 6px;
            transition: all 0.3s ease;
        }

        .nav-links a:hover {
            background: #e9ecef;
            color: #009900;
        }

        .logout-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .logout-btn:hover {
            background: #c82333;
            transform: translateY(-2px);
        }

        .dashboard-content {
            padding: 30px;
        }

        .section-card {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }

        .section-card:hover {
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
        }

        .section-card h2 {
            color: #009900;
            margin-bottom: 20px;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-card h2::before {
            content: '📝';
            font-size: 1.2rem;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #495057;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: #009900;
            box-shadow: 0 0 0 3px rgba(0, 153, 0, 0.1);
        }

        .form-group textarea {
            resize: vertical;
            min-height: 100px;
        }

        .dynamic-list {
            margin-bottom: 20px;
        }

        .list-item {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .list-item input {
            flex: 1;
            border: 1px solid #dee2e6;
            padding: 8px;
            border-radius: 4px;
        }

        .list-item button {
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .list-item button:hover {
            background: #c82333;
        }

        .add-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 15px;
        }

        .add-btn:hover {
            background: #218838;
            transform: translateY(-2px);
        }

        .slide-item {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
        }

        .slide-item h4 {
            color: #009900;
            margin-bottom: 15px;
        }

        .slide-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .slide-grid .form-group {
            margin-bottom: 15px;
        }

        .save-btn {
            background: linear-gradient(135deg, #009900 0%, #007700 100%);
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 30px;
        }

        .save-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(0, 153, 0, 0.3);
        }

        .message {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
        }

        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        @media (max-width: 768px) {
            .slide-grid {
                grid-template-columns: 1fr;
            }
            
            .dashboard-nav {
                flex-direction: column;
                gap: 15px;
            }
            
            .nav-links {
                flex-wrap: wrap;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <div class="dashboard-header">
            <h1>NMCL Admin Dashboard</h1>
            <p>Manage your website content with ease</p>
        </div>

        <div class="dashboard-nav">
            <div class="nav-links">
                <a href="#top-header">Top Header</a>
                <a href="#navigation">Navigation</a>
                <a href="#news-ticker">News Ticker</a>
                <a href="#hero-slider">Hero Slider</a>
                <a href="#content">Content</a>
                <a href="#contact">Contact</a>
                <a href="#footer">Footer</a>
            </div>
            <a href="logout.php" class="logout-btn">Logout</a>
        </div>

        <div class="dashboard-content">
            <div id="message" class="message"></div>

            <form id="contentForm" method="post" action="save-content.php">
                
                <!-- Top Header Section -->
                <div id="top-header" class="section-card">
                    <h2>Top Header</h2>
                    <div class="form-group">
                        <label for="welcomeText">Welcome Message</label>
                        <input type="text" id="welcomeText" name="topHeader[welcomeText]" 
                               value="<?php echo htmlspecialchars($content['topHeader']['welcomeText'] ?? ''); ?>">
                    </div>
                </div>

                <!-- Navigation Section -->
                <div id="navigation" class="section-card">
                    <h2>Navigation Menu</h2>
                    <div class="dynamic-list">
                        <?php if (isset($content['mainHeader']['navigation']) && is_array($content['mainHeader']['navigation'])): ?>
                            <?php foreach ($content['mainHeader']['navigation'] as $index => $item): ?>
                                <div class="list-item">
                                    <input type="text" name="mainHeader[navigation][<?php echo $index; ?>][label]" 
                                           placeholder="Label" value="<?php echo htmlspecialchars($item['label'] ?? ''); ?>">
                                    <input type="text" name="mainHeader[navigation][<?php echo $index; ?>][link]" 
                                           placeholder="Link" value="<?php echo htmlspecialchars($item['link'] ?? ''); ?>">
                                    <button type="button" onclick="removeItem(this)">Remove</button>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                    <button type="button" class="add-btn" onclick="addNavigationItem()">Add Navigation Item</button>
                </div>

                <!-- News Ticker Section -->
                <div id="news-ticker" class="section-card">
                    <h2>News Ticker</h2>
                    <div class="dynamic-list" id="newsTickerList">
                        <?php if (isset($content['newsTicker']) && is_array($content['newsTicker'])): ?>
                            <?php foreach ($content['newsTicker'] as $index => $item): ?>
                                <div class="list-item">
                                    <input type="text" name="newsTicker[<?php echo $index; ?>]" 
                                           placeholder="News item" value="<?php echo htmlspecialchars($item); ?>">
                                    <button type="button" onclick="removeItem(this)">Remove</button>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                    <button type="button" class="add-btn" onclick="addNewsItem()">Add News Item</button>
                </div>

                <!-- Hero Slider Section -->
                <div id="hero-slider" class="section-card">
                    <h2>Hero Slider</h2>
                    <div id="heroSlidesList">
                        <?php if (isset($content['heroSlides']) && is_array($content['heroSlides'])): ?>
                            <?php foreach ($content['heroSlides'] as $index => $slide): ?>
                                <div class="slide-item">
                                    <h4>Slide <?php echo $index + 1; ?></h4>
                                    <div class="slide-grid">
                                        <div class="form-group">
                                            <label>Title</label>
                                            <input type="text" name="heroSlides[<?php echo $index; ?>][title]" 
                                                   value="<?php echo htmlspecialchars($slide['title'] ?? ''); ?>">
                                        </div>
                                        <div class="form-group">
                                            <label>Image</label>
                                            <input type="text" name="heroSlides[<?php echo $index; ?>][image]" 
                                                   value="<?php echo htmlspecialchars($slide['image'] ?? ''); ?>">
                                        </div>
                                        <div class="form-group" style="grid-column: 1 / -1;">
                                            <label>Description</label>
                                            <textarea name="heroSlides[<?php echo $index; ?>][description]"><?php echo htmlspecialchars($slide['description'] ?? ''); ?></textarea>
                                        </div>
                                        <div class="form-group">
                                            <label>Button Text</label>
                                            <input type="text" name="heroSlides[<?php echo $index; ?>][buttonText]" 
                                                   value="<?php echo htmlspecialchars($slide['buttonText'] ?? ''); ?>">
                                        </div>
                                        <div class="form-group">
                                            <label>Button Link</label>
                                            <input type="text" name="heroSlides[<?php echo $index; ?>][buttonLink]" 
                                                   value="<?php echo htmlspecialchars($slide['buttonLink'] ?? ''); ?>">
                                        </div>
                                    </div>
                                    <button type="button" class="add-btn" style="background: #dc3545;" onclick="removeSlide(this)">Remove Slide</button>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                    <button type="button" class="add-btn" onclick="addSlide()">Add Slide</button>
                </div>

                <!-- Content Sections -->
                <div id="content" class="section-card">
                    <h2>Content Sections</h2>
                    
                    <div class="form-group">
                        <label for="aboutTitle">About Title</label>
                        <input type="text" id="aboutTitle" name="about[title]" 
                               value="<?php echo htmlspecialchars($content['about']['title'] ?? ''); ?>">
                    </div>
                    
                    <div class="form-group">
                        <label for="aboutContent">About Content</label>
                        <textarea id="aboutContent" name="about[content]"><?php echo htmlspecialchars($content['about']['content'] ?? ''); ?></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="missionContent">Mission</label>
                        <textarea id="missionContent" name="mission[content]"><?php echo htmlspecialchars($content['mission']['content'] ?? ''); ?></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="visionContent">Vision</label>
                        <textarea id="visionContent" name="vision[content]"><?php echo htmlspecialchars($content['vision']['content'] ?? ''); ?></textarea>
                    </div>
                </div>

                <!-- Contact Section -->
                <div id="contact" class="section-card">
                    <h2>Contact Information</h2>
                    <div class="slide-grid">
                        <div class="form-group">
                            <label for="contactAddress">Address</label>
                            <input type="text" id="contactAddress" name="contact[address]" 
                                   value="<?php echo htmlspecialchars($content['contact']['address'] ?? ''); ?>">
                        </div>
                        <div class="form-group">
                            <label for="contactPhone">Phone</label>
                            <input type="text" id="contactPhone" name="contact[phone]" 
                                   value="<?php echo htmlspecialchars($content['contact']['phone'] ?? ''); ?>">
                        </div>
                        <div class="form-group">
                            <label for="contactEmail">Email</label>
                            <input type="text" id="contactEmail" name="contact[email]" 
                                   value="<?php echo htmlspecialchars($content['contact']['email'] ?? ''); ?>">
                        </div>
                    </div>
                </div>

                <!-- Footer Section -->
                <div id="footer" class="section-card">
                    <h2>Footer</h2>
                    <div class="form-group">
                        <label for="footerText">Footer Text</label>
                        <textarea id="footerText" name="footer[text]"><?php echo htmlspecialchars($content['footer']['text'] ?? ''); ?></textarea>
                    </div>
                </div>

                <button type="submit" class="save-btn">Save All Changes</button>
            </form>
        </div>
    </div>

    <script>
        let navigationIndex = <?php echo count($content['mainHeader']['navigation'] ?? []); ?>;
        let newsIndex = <?php echo count($content['newsTicker'] ?? []); ?>;
        let slideIndex = <?php echo count($content['heroSlides'] ?? []); ?>;

        function addNavigationItem() {
            const container = document.querySelector('#navigation .dynamic-list');
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <input type="text" name="mainHeader[navigation][${navigationIndex}][label]" placeholder="Label">
                <input type="text" name="mainHeader[navigation][${navigationIndex}][link]" placeholder="Link">
                <button type="button" onclick="removeItem(this)">Remove</button>
            `;
            container.appendChild(item);
            navigationIndex++;
        }

        function addNewsItem() {
            const container = document.getElementById('newsTickerList');
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <input type="text" name="newsTicker[${newsIndex}]" placeholder="News item">
                <button type="button" onclick="removeItem(this)">Remove</button>
            `;
            container.appendChild(item);
            newsIndex++;
        }

        function addSlide() {
            const container = document.getElementById('heroSlidesList');
            const slide = document.createElement('div');
            slide.className = 'slide-item';
            slide.innerHTML = `
                <h4>Slide ${slideIndex + 1}</h4>
                <div class="slide-grid">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="heroSlides[${slideIndex}][title]">
                    </div>
                    <div class="form-group">
                        <label>Image</label>
                        <input type="text" name="heroSlides[${slideIndex}][image]">
                    </div>
                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label>Description</label>
                        <textarea name="heroSlides[${slideIndex}][description]"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Button Text</label>
                        <input type="text" name="heroSlides[${slideIndex}][buttonText]">
                    </div>
                    <div class="form-group">
                        <label>Button Link</label>
                        <input type="text" name="heroSlides[${slideIndex}][buttonLink]">
                    </div>
                </div>
                <button type="button" class="add-btn" style="background: #dc3545;" onclick="removeSlide(this)">Remove Slide</button>
            `;
            container.appendChild(slide);
            slideIndex++;
        }

        function removeItem(button) {
            button.parentElement.remove();
        }

        function removeSlide(button) {
            button.parentElement.remove();
        }

        // Form submission with AJAX
        document.getElementById('contentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const messageDiv = document.getElementById('message');
            
            fetch('save-content.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messageDiv.className = 'message success';
                    messageDiv.textContent = 'Content saved successfully!';
                    messageDiv.style.display = 'block';
                    
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Hide message after 5 seconds
                    setTimeout(() => {
                        messageDiv.style.display = 'none';
                    }, 5000);
                } else {
                    messageDiv.className = 'message error';
                    messageDiv.textContent = 'Error: ' + (data.message || 'Unknown error occurred');
                    messageDiv.style.display = 'block';
                }
            })
            .catch(error => {
                messageDiv.className = 'message error';
                messageDiv.textContent = 'Error: ' + error.message;
                messageDiv.style.display = 'block';
            });
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    </script>
</body>
</html>