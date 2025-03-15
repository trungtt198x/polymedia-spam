import { LinkExternal } from "@polymedia/suitcase-react";
import { GitHubLogo } from  "./GitHubLogo";

export const Footer: React.FC = () =>
(
    <footer>
        <div id="icons">
            <LinkExternal href="https://polymedia.app" follow={true}>
                <img alt="polymedia" src="https://assets.polymedia.app/img/all/logo-nomargin-transparent-512x512.webp" className="icon" />
            </LinkExternal>
            <LinkExternal href="https://github.com/trungtt198x/polymedia-spam" follow={true}>
                <GitHubLogo />
            </LinkExternal>
        </div>
    </footer>
);