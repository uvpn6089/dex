document.addEventListener('DOMContentLoaded', () => {
    const countDisplay = document.getElementById('count'); // matches your HTML display element
    const clickBtn = document.getElementById('like-button');     // matches your button element

    // 1. Fetch initial count from backend on load
    fetch('/api/counter')
        .then(res => res.json())
        .then(data => {
            if (countDisplay) countDisplay.textContent = data.count;
        })
        .catch(err => console.error('Error loading count:', err));

    // 2. Increment count on click
    if (clickBtn) {
        clickBtn.addEventListener('click', () => {
            fetch('/api/counter/increment', { method: 'POST' })
                .then(res => res.json())
                .then(data => {
                    if (countDisplay) countDisplay.textContent = data.count;
                })
                .catch(err => console.error('Error incrementing count:', err));
        });
    }
});
