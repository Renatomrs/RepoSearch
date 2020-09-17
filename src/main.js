import api from './services/api';

class app {
    constructor() {
        this.repositories = [];
        this.popupInfoEl = document.querySelector('.popup-info');
        this.loadingPageEl = document.querySelector('.loading');
        this.formEl = document.getElementById('repo-form');
        this.inputEl = document.querySelector('input[name=repository]');
        this.resultEl = document.querySelector('.result');
        
        this.registerHandlers();
    }
    
    registerHandlers() {
        this.formEl.onsubmit =  event => this.addRepository(event);
    }

    setLoading(loading = true) {
        if (loading === true) {
            let loadingEl = document.createElement('div');
            loadingEl.setAttribute('id', 'loadingContainer');

            let loadingImgEl = document.createElement('img');
            loadingImgEl.setAttribute('id', 'loadingIcon');
            loadingImgEl.setAttribute('src' , 'assets/loading.svg');

            loadingEl.appendChild(loadingImgEl);

            this.loadingPageEl.appendChild(loadingEl);

        } else {
            document.getElementById('loadingContainer').remove();
        }
    }

    popup() {
            
        let containerPopupInfoEl = document.createElement('section');
        containerPopupInfoEl.setAttribute('id', 'container-popup-info');

        let infoBox = document.createElement('article');
        infoBox.setAttribute('id', 'box-info');
    
        let infoEL = document.createElement('p');
        infoEL.setAttribute('id', 'text-info');
        infoEL.appendChild(document.createTextNode('Ops! You put the wrong name or does not exist.'));

        let infoIcon = document.createElement('img');
        infoIcon.setAttribute('id', 'info-icon');
        infoIcon.setAttribute('src', 'assets/infoIcon.svg');
    
        let btnEl = document.createElement('button');
        btnEl.setAttribute('id', 'btn-box-info');
        btnEl.appendChild(document.createTextNode('Ok'));
        btnEl.addEventListener('click', () => document.getElementById('container-popup-info').remove());

        infoBox.appendChild(infoIcon);
        infoBox.appendChild(infoEL);
        infoBox.appendChild(btnEl);
            
        containerPopupInfoEl.appendChild(infoBox);

        this.popupInfoEl.appendChild(containerPopupInfoEl);
    }

    async addRepository(event) {
        event.preventDefault();

        const repoInput = this.inputEl.value;

        if (repoInput.length === 0) {
            return;

        } else {
            this.setLoading();
        }  

        try {
            const response = await api.get(`/repos/${repoInput}`);

            const { name, description, html_url, owner: { avatar_url } } = response.data;

            this.repositories.unshift ({
                name,
                description,
                avatar_url,
                html_url,
            });

            this.inputEl.value = '';

            this.render();

        } catch (err) {
            this.popup();
        }

        this.setLoading(false);
        this.inputEl.value = '';
    }

    render() {
        this.resultEl.innerHTML = '';

        this.repositories.forEach(repo => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let titleEl = document.createElement('span');
            titleEl.appendChild(document.createTextNode(repo.name));

            let descriptionEl = document.createElement('p');
            descriptionEl.appendChild(document.createTextNode(repo.description));
            
            let iconLinkEl = document.createElement('span');
            iconLinkEl.setAttribute('class', 'fas fa-external-link-alt');
            iconLinkEl.setAttribute('id', 'externalLinkIcon');
            
            let linkEl = document.createElement('a');
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('href', repo.html_url);
            linkEl.setAttribute('id', 'linkIcon');
            linkEl.appendChild(document.createTextNode('Access'));
            linkEl.appendChild(iconLinkEl);

            let headerEl = document.createElement('header');
            headerEl.appendChild(imgEl);
            headerEl.appendChild(titleEl);

            let footerEl = document.createElement('footer');
            footerEl.appendChild(linkEl);

            let contentEl = document.createElement('article');
            contentEl.setAttribute('class', 'content-result');
            contentEl.appendChild(headerEl);
            contentEl.appendChild(descriptionEl);
            contentEl.appendChild(footerEl);
            
            this.resultEl.appendChild(contentEl);
        });
        
    }
}

new app();