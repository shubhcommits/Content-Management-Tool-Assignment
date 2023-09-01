document.addEventListener('DOMContentLoaded', function () {
    const formContainer = document.querySelector('#addForm form');
    const inputTitle = document.getElementById('title');
    const inputContent = document.getElementById('content');
    const tableArticles = document.querySelector('#articleTable table');
    const contentArea = document.getElementById("contentArea");
    
    let storedArticles = JSON.parse(localStorage.getItem('articles')) || [];

    // Function to update the article table
    function updateArticleTable() {
        tableArticles.innerHTML = `
            <tr>
                <th>Title</th>
                <th>Actions</th>
            </tr>
        `;

        for (const [index, article] of storedArticles.entries()) {
            const newRow = tableArticles.insertRow();
            const titleCell = newRow.insertCell();
            const actionsCell = newRow.insertCell();

            titleCell.textContent = article.title;
            titleCell.classList.add('article-title');

            actionsCell.innerHTML = `
                <div class="btn-container">
                    <button class="btn-edit" data-index="${index}">Edit</button>
                    <button class="btn-delete" data-index="${index}">Delete</button>
                </div>
            `;
        }
    }

    // Loading articles from localStorage when the page loads
    window.addEventListener('load', function () {
        updateArticleTable();
    });

    // Handling form submission for adding new articles
    formContainer.addEventListener('submit', function (event) {
        event.preventDefault();
        const title = inputTitle.value;
        const content = inputContent.value;
        storedArticles.push({ title, content });
        localStorage.setItem('articles', JSON.stringify(storedArticles));
        updateArticleTable();
        inputTitle.value = '';
        inputContent.value = '';
    });

    // Handling clicks on the article table
    tableArticles.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-edit')) {
            const index = event.target.getAttribute('data-index');
            const article = storedArticles[index];
            inputTitle.value = article.title;
            inputContent.value = article.content;
            storedArticles.splice(index, 1);
            localStorage.setItem('articles', JSON.stringify(storedArticles));
            updateArticleTable();
        } else if (event.target.classList.contains('btn-delete')) {
            const index = event.target.getAttribute('data-index');
            storedArticles.splice(index, 1);
            localStorage.setItem('articles', JSON.stringify(storedArticles));
            updateArticleTable();
        }
    });

    // Handling click events for adding images
    document.getElementById("addImage").addEventListener("click", (event) => {
        event.preventDefault();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imgElement = document.createElement("img");
                    imgElement.src = e.target.result;
                    imgElement.alt = "Image";
                    contentArea.appendChild(imgElement);
                };
                reader.readAsDataURL(file);
            }
        });
        input.click();
    });

    // Handling click events for adding videos
    document.getElementById("addVideo").addEventListener("click", (event) => {
        event.preventDefault();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "video/*";
        input.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const videoElement = document.createElement("video");
                    videoElement.controls = true;
                    videoElement.innerHTML = `<source src="${e.target.result}" type="video/mp4">Your browser does not support the video tag.`;
                    contentArea.appendChild(videoElement);
                };
                reader.readAsDataURL(file);
            }
        });
        input.click();
    });

    // Saving content to local storage before leaving the page
    window.addEventListener("beforeunload", () => {
        localStorage.setItem("articles", JSON.stringify(storedArticles));
    });
});
