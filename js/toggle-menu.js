window.addEventListener('load', function () {
    const button = document.querySelector('.toggle-menu-button');
    const menu = document.querySelector('.header-site-menu');
    const overlay = document.querySelector('.menu-overlay');

    if (button && menu && overlay) {

        function closeMenu() {
            menu.classList.remove('is-show');
            overlay.classList.remove('is-show');
        }

        function openMenu() {
            menu.classList.add('is-show');
            overlay.classList.add('is-show');
        }

        button.addEventListener('click', function () {
            if (menu.classList.contains('is-show')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // 背景をクリックしたら閉じる
        overlay.addEventListener('click', closeMenu);
    }
});