const form = document.querySelector('form');

form?.addEventListener('submit', function (e) {
    e.preventDefault(); 

    const data = new FormData(form);

    let params = [];

    for (let [name, value] of data) {
        const encodedValue = encodeURIComponent(value);
        params.push(`${name}=${encodedValue}`);
    }

    const url = form.action + '?' + params.join('&');

    location.href = url;
});