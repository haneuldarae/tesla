// Tesla Crisis Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize financial comparison chart
    initFinancialChart();
    
    // Add smooth scroll behavior
    addSmoothScrolling();
    
    // Add interactive animations
    addAnimations();
    
    // Add hover effects for timeline items
    addTimelineInteractions();
});

function initFinancialChart() {
    const ctx = document.getElementById('financialChart');
    if (!ctx) return;
    
    const financialData = {
        labels: ['매출 (억달러)', '순이익 (백만달러)', '주당순이익', '인도량 (천대)'],
        datasets: [
            {
                label: 'Q1 2025',
                data: [193.4, 409, 0.27, 336],
                backgroundColor: '#e74c3c',
                borderColor: '#c0392b',
                borderWidth: 2,
                borderRadius: 6
            },
            {
                label: 'Q1 2024',
                data: [213.0, 1390, 0.41, 423],
                backgroundColor: '#95a5a6',
                borderColor: '#7f8c8d',
                borderWidth: 2,
                borderRadius: 6
            }
        ]
    };

    const config = {
        type: 'bar',
        data: financialData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Q1 2025 vs Q1 2024 재무 성과 비교',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#2c3e50'
                },
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(44, 62, 80, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#3498db',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            
                            // Format numbers based on metric type
                            const value = context.parsed.y;
                            const metric = context.label;
                            
                            if (metric.includes('매출')) {
                                label += '$' + value.toFixed(1) + 'B';
                            } else if (metric.includes('순이익')) {
                                label += '$' + value.toLocaleString() + 'M';
                            } else if (metric.includes('주당순이익')) {
                                label += '$' + value.toFixed(2);
                            } else if (metric.includes('인도량')) {
                                label += value.toLocaleString() + '대';
                            }
                            
                            return label;
                        },
                        afterLabel: function(context) {
                            // Calculate percentage change
                            const currentData = financialData.datasets[0].data;
                            const previousData = financialData.datasets[1].data;
                            const index = context.dataIndex;
                            
                            if (context.datasetIndex === 0) {
                                const change = ((currentData[index] - previousData[index]) / previousData[index] * 100);
                                return `변화율: ${change.toFixed(1)}%`;
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(149, 165, 166, 0.2)'
                    },
                    ticks: {
                        color: '#7f8c8d',
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#7f8c8d',
                        font: {
                            size: 11
                        },
                        maxRotation: 45
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    };

    new Chart(ctx, config);
}

function addSmoothScrolling() {
    // Add smooth scrolling to anchor links
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
}

function addAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all main sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Staggered animation for metric cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 500 + index * 100);
    });

    // Staggered animation for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(timelineItems).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        timelineObserver.observe(item);
    });
}

function addTimelineInteractions() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Highlight the timeline dot
            const dot = this.querySelector('::before');
            this.style.boxShadow = '0 8px 25px rgba(52, 152, 219, 0.15)';
            
            // Add subtle pulse effect to impact badge
            const badge = this.querySelector('.impact-badge');
            if (badge) {
                badge.style.transform = 'scale(1.05)';
                badge.style.transition = 'transform 0.2s ease';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            
            const badge = this.querySelector('.impact-badge');
            if (badge) {
                badge.style.transform = 'scale(1)';
            }
        });
    });
}

// Add click handlers for interactive elements
function addClickHandlers() {
    // Technical levels hover information
    const levelRows = document.querySelectorAll('.level-row:not(.header)');
    levelRows.forEach(row => {
        row.addEventListener('click', function() {
            // Toggle additional information or highlight
            this.classList.toggle('selected');
        });
    });

    // Competition table row interactions
    const tableRows = document.querySelectorAll('.table-row:not(.table-header)');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // Highlight selected company
            tableRows.forEach(r => r.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

// Add real-time updates simulation
function simulateRealTimeUpdates() {
    // Simulate price updates every 30 seconds (for demo purposes)
    setInterval(() => {
        const currentPrice = 284.70;
        const variation = (Math.random() - 0.5) * 2; // +/- 1%
        const newPrice = currentPrice * (1 + variation / 100);
        
        // Update price display if element exists
        const priceElement = document.querySelector('.current-price');
        if (priceElement) {
            priceElement.textContent = '$' + newPrice.toFixed(2);
            
            // Add flash effect
            priceElement.style.background = variation > 0 ? '#27ae60' : '#e74c3c';
            priceElement.style.color = '#fff';
            priceElement.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                priceElement.style.background = '';
                priceElement.style.color = '';
            }, 1000);
        }
    }, 30000);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    addClickHandlers();
    // simulateRealTimeUpdates(); // Uncomment for live demo
    
    // Add loading complete class to body
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
});

// Utility functions
function formatNumber(num, decimals = 0) {
    return num.toLocaleString('ko-KR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function formatCurrency(num, decimals = 2) {
    return '$' + num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function formatPercentage(num, decimals = 1) {
    return num.toFixed(decimals) + '%';
}

// Export functions for potential external use
window.TeslaDashboard = {
    formatNumber,
    formatCurrency,
    formatPercentage,
    initFinancialChart
};