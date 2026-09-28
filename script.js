// Menampilkan efek saat halaman selesai dimuat

document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("mainNav");
    const navLinks = document.querySelectorAll("nav a");
    const sections = document.querySelectorAll("main[id], section[id]");

    console.log("Portfolio berhasil dimuat!");


    /* ---------- Mobile menu ---------- */

    function closeMenu() {
        nav.classList.remove("open");
        menuBtn.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
    }

    menuBtn.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");

        menuBtn.classList.toggle("active", isOpen);
        menuBtn.setAttribute("aria-expanded", isOpen);
    });

    // Tutup menu setiap kali salah satu link navbar diklik
    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    // Tutup menu juga saat klik di luar area navbar
    document.addEventListener("click", (event) => {
        const insideNavbar = event.target.closest(".navbar");

        if (!insideNavbar && nav.classList.contains("open")) {
            closeMenu();
        }
    });

    // Tutup menu saat ukuran layar kembali ke desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }

        setActiveLink();
    });


    /* ---------- Menandai link navbar sesuai section aktif ---------- */

    function setActiveLink() {

        const navHeight = document.querySelector(".navbar").offsetHeight;

        let activeId = sections[0].id;

        // section yang punyanya top sudah di atas navbar
        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= navHeight + 1) {
                activeId = section.id;
            }
        });

        // Section terakhir (mis. Contact) sering nggak bisa sampai ke atas
        // viewport karena halaman sudah mentok di scroll paling bawah.
        // Kalau sudah di bawah, paksa section terakhir jadi yang aktif.
        const atBottom =
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

        if (atBottom) {
            activeId = sections[sections.length - 1].id;
        }

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + activeId);
        });
    }

    window.addEventListener("scroll", setActiveLink, { passive: true });
    setActiveLink();


    /* ---------- Paksa link anchor (#about, #projects, ...) scroll di tab yang sama ---------- */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            // link placeholder ("#") di tombol CV / socials / project
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            // kalau target-nya tidak ada, biarin browser yang handle
            if (!target) return;

            // stop perilaku default (bisa kebuka di tab baru)
            event.preventDefault();

            // geser halaman smooth ke section tujuan
            target.scrollIntoView({ behavior: "smooth", block: "start" });

            // update URL tanpa reload / tanpa lompat
            history.replaceState(null, "", targetId);

            // langsung pindah penanda, biar nggak nunggu event scroll
            // (penting kalau halaman sudah ada di posisi paling bawah)
            setActiveLink();
        });
    });

});
