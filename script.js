document.addEventListener('DOMContentLoaded', function() {
    // 1. Animasi Scroll Halus untuk Navigasi
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // 2. Inisialisasi Elemen
    const envelope = document.getElementById('envelope');
    const openBtn = document.getElementById('openInvitationBtn');
    const invitationOverlay = document.getElementById('invitationOverlay');
    const weddingMusic = document.getElementById('weddingMusic');
    let musicPlayed = false;

    // 3. Nonaktifkan Scroll Awal
    document.body.style.overflow = 'hidden';

    // 4. Fungsi Pemutar Musik
    function playWeddingMusic() {
        if (musicPlayed) return;
        
        // Set volume (opsional, 0.0 - 1.0)
        weddingMusic.volume = 0.7;
        
        // Coba memutar musik
        const playPromise = weddingMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicPlayed = true;
                console.log('Musik berhasil diputar');
            }).catch(error => {
                console.log('Autoplay diblokir:', error);
                showMusicButton();
            });
        }
    }

    // 5. Fungsi Tombol Musik Manual
    function showMusicButton() {
        const existingBtn = document.getElementById('manualMusicBtn');
        if (existingBtn) return;
        
        const musicBtn = document.createElement('button');
        musicBtn.id = 'manualMusicBtn';
        musicBtn.innerHTML = '🎵 Putar Musik';
        musicBtn.style.position = 'fixed';
        musicBtn.style.bottom = '20px';
        musicBtn.style.right = '20px';
        musicBtn.style.zIndex = '10000';
        musicBtn.style.padding = '10px 20px';
        musicBtn.style.borderRadius = '25px';
        musicBtn.style.backgroundColor = '#8b5a2b';
        musicBtn.style.color = 'white';
        musicBtn.style.border = 'none';
        musicBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        musicBtn.style.cursor = 'pointer';
        musicBtn.style.fontFamily = 'Montserrat, sans-serif';
        musicBtn.style.fontSize = '14px';
        musicBtn.style.transition = 'all 0.3s ease';
        
        musicBtn.addEventListener('mouseover', () => {
            musicBtn.style.transform = 'scale(1.05)';
            musicBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        });
        
        musicBtn.addEventListener('mouseout', () => {
            musicBtn.style.transform = 'scale(1)';
            musicBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        });
        
        musicBtn.addEventListener('click', () => {
            weddingMusic.play();
            musicBtn.remove();
            musicPlayed = true;
        });
        
        document.body.appendChild(musicBtn);
    }

    // 6. Animasi Amplop
    if (envelope) {
        envelope.addEventListener('click', function() {
            this.classList.add('open');
        });
    }

    // 7. Buka Undangan
    if (openBtn && invitationOverlay) {
        openBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            invitationOverlay.classList.add('hide');
            
            // Putar musik
            playWeddingMusic();
            
            // Hapus overlay setelah animasi
            setTimeout(() => {
                invitationOverlay.remove();
                document.body.style.overflow = 'auto';
            }, 1000);
        });
    }

    // 8. Auto-open untuk Mobile
    if (window.innerWidth <= 768 && envelope) {
            setTimeout(() => {
                envelope.classList.add('open');
                
                let firstInteraction = false;
                const handleInteraction = () => {
                    if (!firstInteraction) {
                        playWeddingMusic();
                        firstInteraction = true;
                        document.removeEventListener('click', handleInteraction);
                        document.removeEventListener('touchstart', handleInteraction);
                    }
                };
                
                document.addEventListener('click', handleInteraction, {once: true});
                document.addEventListener('touchstart', handleInteraction, {once: true});
            }, 2000);
        }

    // 9. Form RSVP
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const guests = document.getElementById('guests').value;
            const attending = document.getElementById('attending').value;
            
            if (!name) {
                alert('Silakan masukkan nama Anda');
                return;
            }
            
            // Simpan ke localStorage
            localStorage.setItem('rsvpName', name);
            localStorage.setItem('rsvpGuests', guests);
            localStorage.setItem('rsvpAttending', attending);
            
            // Tampilkan konfirmasi
            const message = attending === 'yes' 
                ? `Terima kasih ${name}, kami tunggu kehadiran Anda dengan ${guests} tamu!`
                : `Terima kasih ${name}, kami hargai konfirmasi Anda.`;
                
            alert(message);
            rsvpForm.reset();
        });
    }

    // 10. Load Data RSVP yang Tersimpan
    const savedName = localStorage.getItem('rsvpName');
    if (savedName) {
        document.getElementById('name').value = savedName;
        document.getElementById('guests').value = localStorage.getItem('rsvpGuests') || '1';
        document.getElementById('attending').value = localStorage.getItem('rsvpAttending') || 'yes';
    }

    // 11. Animasi Scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.couple-img, .event');
        const screenPosition = window.innerHeight / 1.3;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Inisialisasi animasi
    const animatedElements = document.querySelectorAll('.couple-img, .event');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Jalankan sekali saat load
});