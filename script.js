// window.addEventListener('scroll', function() {
//     const parallax = document.querySelectorAll('.parallax');
//     let scrollPosition = window.pageYOffset;

//     parallax.forEach(function(element) {
//         element.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)';
//     });
// });

const ctx = document.getElementById('servicesChart').getContext('2d');
const data = [70, 5, 10, 10, 5];  // Percentages for each category
const total = data.reduce((a, b) => a + b, 0);  // Sum of percentages
const labels = [
    'Development',   // Combined 'Web Development', 'Mobile App Development', 'Web Design'
    'Database Administration',
    'Web Testing',
    'IT Solutions',
    'Market Analysis'
];
const colors = [
    '#003f5c',   // Colors for each section
    '#58508d',
    '#8871A0',
    '#A2C3DB',
    '#3F9F9F'
];

let servicesChart;  // Store the chart instance

// Function to create the chart with animation
function createRollingChart() {
    if (servicesChart) {
        servicesChart.destroy();  // Destroy the existing chart before re-initializing it
    }

    servicesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Service Distribution',
                data: data,
                backgroundColor: colors,
                hoverOffset: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // For flexible sizing
            cutout: '65%',  // Adjusts the thickness of the donut
            rotation: -Math.PI / 2,  // Start the donut rotated at -90 degrees
            animation: {
                animateRotate: true,  // Enable rotation animation
                duration: 2500,  // Animation duration in milliseconds
                easing: 'easeOutBounce',  // Optional easing function for bounce effect
                onComplete: function() {
                    console.log('Animation complete!');  // Log once the animation is done (optional)
                }
            },
            plugins: {
                legend: {
                    display: false  // We hide the default legend to create a custom one
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw + '%'; // Shows label and percentage
                        }
                    }
                }
            }
        }
    });
}

// Custom Legend Generation
const customLegend = document.getElementById('customLegend');
labels.forEach((label, index) => {
    const percentage = ((data[index] / total) * 100).toFixed(2); // Calculate percentage for each label
    const legendItem = `
        <div class="legend-item">
            <div>
                <span style="background-color: ${colors[index]}; width: 12px; height: 12px; margin-left:10px; display: inline-block;"></span>
                ${label}: ${percentage}%
            </div>
        </div>`;
    customLegend.innerHTML += legendItem;
});

// Scroll Trigger to Start Animation Every Time It Scrolls into View
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            createRollingChart();  // Create and animate the chart when it's in view
        }
    });
}, { threshold: 0.3 }); 

// Observe the chart container
chartObserver.observe(document.querySelector('.chart-container'));

const form = document.querySelector('#contact-form');
const items = document.querySelectorAll(".item");
const email = document.getElementById("email");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    checkInputs();
    checkEmail(); // Validate email separately
    const isValid = [...items].every(item => !item.classList.contains('error'));
    if (isValid) {
        sendEmail();
    }
});

function checkInputs() {
    items.forEach(item => {
        const errorTxt = item.nextElementSibling;
        if (item.value.trim() === "") {
            item.classList.add("error");
            errorTxt.classList.add("show");
            errorTxt.innerText = "This field cannot be blank";
        } else {
            item.classList.remove("error");
            errorTxt.classList.remove("show");
        }
    });
}

function checkEmail() {
    const emailRegex = /^([a-z\d.-]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/;
    const errorTxtEmail = email.nextElementSibling;

    if (!email.value.match(emailRegex)) {
        email.classList.add("error");
        errorTxtEmail.innerText = "Enter a valid email address";
        errorTxtEmail.classList.add("show");
    } else {
        email.classList.remove("error");
        errorTxtEmail.classList.remove("show");
    }
}

function sendEmail() {
    const bodyMessage = `
    Full Name: ${document.getElementById("name").value}<br>
    Email: ${email.value}<br>
    Phone Number: ${document.getElementById("phone").value}<br>
    Message: ${document.getElementById("message").value}<br>
    `;

    Email.send({
        SecureToken : "facc9e21-6425-458e-950a-79fb8baaf567",
        Port: "2525", // Try other ports like 587, 25, or 465
        To : 'codificasoluzioni@gmail.com',
        From : "codificasoluzioni@gmail.com",   
        Subject: document.getElementById("subject").value,
        Body: bodyMessage


    }).then(message => {
        if (message === "OK") {
            Swal.fire({
                title: "Success",
                text: "Message sent successfully",
                icon: "success"
            });
        } else {
            Swal.fire({
                title: "Error",
                text: "Message failed to send. Please try again.",
                icon: "error"
            });
        }
    }).catch(error => {
        Swal.fire({
            title: "Error",
            text: `Message failed to send: ${error}`,
            icon: "error"
        });
    });
}
