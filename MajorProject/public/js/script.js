// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


  let currentIndex = 0;

        function showNextCards() {
            const slider = document.querySelector('.slider');
            const cards = document.querySelectorAll('.card-new');
            const totalCards = cards.length;

            currentIndex = (currentIndex + 1) % totalCards;

            slider.style.transform = `translateX(-${currentIndex * 300}px)`;

            if (currentIndex >= totalCards - 3) {
                setTimeout(() => {
                    slider.style.transition = 'none';
                    currentIndex = 0;
                    slider.style.transform = `translateX(0px)`;
                    setTimeout(() => {
                        slider.style.transition = 'transform 0.5s ease-in-out';
                    }, 50);
                }, 500);
            }
        }

        // Automatically show next cards every 2 seconds
        setInterval(showNextCards, 2000);