
$(document).ready(function(){
    $('.status-select').change(function(){
        var status = $(this).val();
        var id = $(this).data('id');
        $.ajax({
            url: '/update_status', 
            type: 'POST',
            data: {
                'status': status,
                'id': id
            },
            success: function(result){
                const card = $(`[data-id="${id}"]`).closest('.application-card');
                const badge = card.find('.status-badge');
                badge.removeClass('status-pending status-accepted status-rejected');
                badge.addClass(`status-${status}`);
                badge.text(status.charAt(0).toUpperCase() + status.slice(1));
                
                showAlert('Application status updated successfully!', 'success');
            },
            error: function(error){
                showAlert('Error updating status. Please try again.', 'danger');
                console.error('Status update error:', error);
            }
        });
    });

    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 10000);

    $('.btn-close').click(function(){
        $(this).parent().hide();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    // Navigation functionality
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav links
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all page sections
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const targetSection = document.getElementById(this.dataset.section);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Department edit functionality
    document.querySelectorAll('.edit-department-btn').forEach(button => {
        button.addEventListener('click', function() {
            const depId = this.dataset.id;
            const depName = this.dataset.name;
            
            const nameInput = document.getElementById('editDepName');
            const idInput = document.getElementById('editDepId');
            const form = document.getElementById('editDepartmentForm');
            
            if (nameInput && idInput && form) {
                nameInput.value = depName;
                idInput.value = depId;
                form.action = `/admin/update-department/${depId}`;
            }
        });
    });

    // Study Level edit functionality
    document.querySelectorAll('.edit-study-btn').forEach(button => {
        button.addEventListener('click', function() {
            const levelId = this.dataset.id;
            const levelName = this.dataset.name;
            
            const nameInput = document.getElementById('editStudyLevelName');
            const idInput = document.getElementById('editStudyLevelId');
            const form = document.getElementById('editStudyLevelForm');
            
            if (nameInput && idInput && form) {
                nameInput.value = levelName;
                idInput.value = levelId;
                form.action = `/admin/update-study-level/${levelId}`;
            }
        });
    });

    // Mobile responsiveness
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        } else if (window.innerWidth > 768 && sidebar.classList.contains('collapsed')) {
            // Only expand if it was collapsed due to mobile view
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    });
});

// File preview functionality
function loadFile(event) {
    var output = document.getElementById('output');
    if (!output) return;
    
    output.innerHTML = "";
    for(let i = 0; i < event.target.files.length; i++){
        var reader = new FileReader();
        reader.onload = function(){
            var img = document.createElement('img');
            img.src = reader.result;
            img.className = 'img-fluid rounded m-1';
            img.style.maxHeight = '80px';
            img.style.maxWidth = '80px';
            img.style.objectFit = 'cover';
            output.appendChild(img);
        };
        reader.readAsDataURL(event.target.files[i]);
    }
}

function loadFile2(event) {
    var output = document.getElementById('output2');
    if (!output) return;
    
    output.innerHTML = "";
    for(let i = 0; i < event.target.files.length; i++){
        var reader = new FileReader();
        reader.onload = function(){
            var img = document.createElement('img');
            img.src = reader.result;
            img.className = 'img-fluid rounded m-1';
            img.style.maxHeight = '80px';
            img.style.maxWidth = '80px';
            img.style.objectFit = 'cover';
            output.appendChild(img);
        };
        reader.readAsDataURL(event.target.files[i]);
    }
}

// Utility function to show alerts
function showAlert(message, type) {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', alertHtml);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        if (alerts.length > 0) {
            const latestAlert = alerts[alerts.length - 1];
            if (window.bootstrap && window.bootstrap.Alert) {
                const bsAlert = new bootstrap.Alert(latestAlert);
                bsAlert.close();
            } else {
                latestAlert.remove();
            }
        }
    }, 5000);
}

// Category deletion function
function deleteCategory(categoryId) {
    if (confirm('Are you sure you want to delete this category?')) {
        fetch(`/admin/delete-news-category/${categoryId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (response.ok) {
                showAlert('Category deleted successfully!', 'success');
                setTimeout(() => location.reload(), 1000);
            } else {
                showAlert('Error deleting category', 'danger');
            }
        }).catch(error => {
            console.error('Error:', error);
            showAlert('Error deleting category', 'danger');
        });
    }
}

// Search functionality for different sections
document.addEventListener("DOMContentLoaded", function () {
    // User search functionality
    setupSearch("userModalSearchInput", "userModalRecommendations", "/admin/search/users");
    setupSearch("loginSearchInput", "loginRecommendations", "/admin/search/users");
    setupSearch("partnerSearchInput", "partnerRecommendations", "/admin/search/partners");
    setupSearch("coursesSearchInput", "coursesRecommendations", "/admin/search/courses");
    
    function setupSearch(inputId, recommendationsId, endpoint) {
        const searchInput = document.getElementById(inputId);
        const recommendations = document.getElementById(recommendationsId);
        
        if (!searchInput || !recommendations) return;

        async function performSearch() {
            const query = searchInput.value.trim();
            if (query === "") {
                recommendations.innerHTML = "";
                return;
            }
            
            try {
                const response = await fetch(`${endpoint}?q=${encodeURIComponent(query)}`);
                if (response.ok) {
                    const data = await response.json();
                    displayRecommendations(data, recommendations, endpoint);
                } else {
                    recommendations.innerHTML = '<div class="alert alert-warning">No results found.</div>';
                }
            } catch (err) {
                console.error('Search error:', err);
                recommendations.innerHTML = '<div class="alert alert-danger">Search error occurred.</div>';
            }
        }

        // Debounced search
        let searchTimeout;
        searchInput.addEventListener("input", function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 300);
        });

        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                performSearch();
            }
        });
    }

    function displayRecommendations(data, container, endpoint) {
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="alert alert-info">No results found.</div>';
            return;
        }

        let html = '<div class="list-group">';
        data.slice(0, 10).forEach((item) => {
            if (endpoint.includes('users')) {
                html += `
                    <a href="/admin/user/${item.id || item.user_id}" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">${item.name} ${item.lastname || ''}</h6>
                            <small>${item.role || 'User'}</small>
                        </div>
                        <p class="mb-1">${item.email}</p>
                        <small>${item.department || 'No department'}</small>
                    </a>
                `;
            } else if (endpoint.includes('courses')) {
                html += `
                    <a href="/admin/course/${item.id}" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">${item.name || item.course_name}</h6>
                            <small>${item.credits || ''} credits</small>
                        </div>
                        <p class="mb-1">${item.description || ''}</p>
                        <small>${item.department || ''}</small>
                    </a>
                `;
            } else {
                html += `
                    <div class="list-group-item">
                        <h6 class="mb-1">${item.name || item.title}</h6>
                        <p class="mb-1">${item.description || item.email || ''}</p>
                    </div>
                `;
            }
        });
        html += '</div>';
        container.innerHTML = html;
    }
});

// Form validation enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add Bootstrap validation classes
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Enhanced file input styling
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : 'Choose file...';
            const label = this.nextElementSibling;
            if (label && label.classList.contains('form-label')) {
                // Update label or create feedback
                let feedback = this.parentNode.querySelector('.file-feedback');
                if (!feedback) {
                    feedback = document.createElement('small');
                    feedback.className = 'file-feedback text-muted';
                    this.parentNode.appendChild(feedback);
                }
                feedback.textContent = this.files.length > 1 ? 
                    `${this.files.length} files selected` : fileName;
            }
        });
    });
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced tooltips (if Bootstrap tooltips are available)
if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Print functionality
function printSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print - ${section.querySelector('h3')?.textContent || 'Section'}</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                    <style>
                        @media print {
                            .no-print { display: none !important; }
                            .btn { display: none !important; }
                        }
                    </style>
                </head>
                <body class="p-4">
                    ${section.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Export functionality (placeholder)
function exportData(type, sectionId) {
    showAlert(`Export ${type} functionality would be implemented here`, 'info');
}

console.log('Protected dashboard initialized with Bootstrap 5 and modern UX features');
