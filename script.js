// User URLs (replace with your actual GitHub username)
const fraeddicUMLUrl = "https://wingdm.github.io/Fraeddic-Userverse-User/fraeddic.uml";
const fraeddicCMLUrl = "https://wingdm.github.io/Fraeddic-Userverse-User/post.cml";
const johnDoeUMLUrl = "https://wingdm.github.io/John-Doe-Userverse-User/john_doe.uml";
const johnDoeCMLUrl = "https://wingdm.github.io/John-Doe-Userverse-User/post.cml";

function displayUser(umlUrl, cmlUrl) {
    // Fetch and Parse UML
    fetch(umlUrl)
        .then(response => response.text())
        .then(uml => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(uml, "application/xml");

            //Clear previous user information.
            document.getElementById('display_name').textContent = "";
            document.getElementById('bio').textContent = "";
            document.getElementById('email').textContent = "";
            document.getElementById('profile_icon').src = "";
            document.getElementById('website').innerHTML = "";
            const styleTags = document.querySelectorAll('style');
            styleTags.forEach(tag => tag.remove());

            //populate new user information.
            document.getElementById('display_name').textContent = xmlDoc.querySelector('dn').textContent;
            document.getElementById('bio').textContent = xmlDoc.querySelector('bio').textContent;
            document.getElementById('email').textContent = xmlDoc.querySelector('em').textContent;
            document.getElementById('profile_icon').src = xmlDoc.querySelector('ic').getAttribute('src');

            const style = document.createElement('style');
            style.innerHTML = xmlDoc.querySelector('style').textContent;
            document.head.appendChild(style);

            const website = xmlDoc.querySelector('web');
            if (website) {
                document.getElementById('website').innerHTML = `<a href="${website.textContent}" target="_blank">Website</a>`;
            }
        })
        .catch(error => console.error("Error fetching UML:", error));

    // Fetch and Parse CML
    fetch(cmlUrl)
        .then(response => response.text())
        .then(cml => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(cml, "application/xml");

            //Clear previous post information.
            document.getElementById('post_title').textContent = "";
            document.getElementById('post_description').textContent = "";
            document.getElementById('post_content').innerHTML = "";

            //populate new post information.
            document.getElementById('post_title').textContent = xmlDoc.querySelector('p').getAttribute('title');
            document.getElementById('post_description').textContent = xmlDoc.querySelector('d').textContent;
            const postContent = document.getElementById('post_content');
            const content = xmlDoc.querySelector('c');

            for (const child of content.children) {
                if (child.tagName === 'txt') {
                    postContent.innerHTML += `<p>${child.textContent}</p>`;
                } else if (child.tagName === 'img') {
                    postContent.innerHTML += `<img src="${child.getAttribute('src')}" alt="Post Image">`;
                } else if (child.tagName === 'vid') {
                    postContent.innerHTML += `<video src="${child.getAttribute('src')}" controls></video>`;
                }
            }
        })
        .catch(error => console.error("Error fetching CML:", error));
}

// Display fraeddic by default.
displayUser(fraeddicUMLUrl, fraeddicCMLUrl);

// Add event listeners to the buttons.
document.getElementById("fraeddicButton").addEventListener("click", function() {
    displayUser(fraeddicUMLUrl, fraeddicCMLUrl);
});

document.getElementById("johnDoeButton").addEventListener("click", function() {
    displayUser(johnDoeUMLUrl, johnDoeCMLUrl);
});