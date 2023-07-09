class GitHubLink extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.innerHTML = `
            <style>
                a {
                    position: absolute;
                    top: 14px;
                    right: 14px;
                    font-family: sans-serif;
                    font-weight: normal;
                    font-size: 16px;
                    color: blue;
                    cursor: pointer;
                    overflow: hidden;
                    pointer-events: auto;
                    text-decoration: none;
                    border: 1px solid blue;
                    padding: 6px 10px;
                    border-radius: 4px;
                }
            </style>
			<a href="https://github.com/lukapopijac/css-rubiks-cube">GitHub</a>
		`;
	}
}
customElements.define('github-link', GitHubLink);
