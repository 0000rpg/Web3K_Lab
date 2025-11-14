document.querySelector('nav ul').addEventListener('wheel', function (e) {
    if (e.deltaY !== 0) {
        e.preventDefault(); // предотвращаем вертикальную прокрутку
        this.scrollLeft += e.deltaY; // прокручиваем по горизонтали
    }
});
