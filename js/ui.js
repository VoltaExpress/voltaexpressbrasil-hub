import { CONFIG } from "./config.js";
import { fileData } from "./data.js";
import { Renderers } from "./renderers.js";

export class UIController {
    constructor() {
        this.treeContainer = document.getElementById("treeContainer");
        this.searchInput = document.getElementById("fileSearch");
        this.currentSelectedFile = null;
        window.uiController = this;
    }

    init() {
        this.renderTree();
        this.updateTotalCount();
        this.setupSearch();
        this.setupMobileMenu();
    }

    updateTotalCount() {
        const contar = (nodes) => nodes.reduce(
            (acc, node) => {
                if (node.type === "file") acc.arquivos++;
                if (node.children) {
                    acc.pastas++;
                    const filhos = contar(node.children);
                    acc.arquivos += filhos.arquivos;
                    acc.pastas += filhos.pastas;
                }
                return acc;
            },
            { arquivos: 0, pastas: 0 }
        );
        const total = contar(fileData);
        const valores = { total: total.arquivos, pastas: total.pastas };
        fileData.forEach(secao => {
            valores[secao.name] = contar(secao.children || []).arquivos;
        });
        document.querySelectorAll("[data-kpi]").forEach(el => {
            const chave = el.getAttribute("data-kpi");
            if (chave in valores) el.textContent = valores[chave];
        });
    }

    renderTree(filteredData = fileData) {
        this.treeContainer.innerHTML = "";
        this.treeContainer.appendChild(this.createTreeNodes(filteredData));
    }

    createTreeNodes(nodes) {
        const ul = document.createElement("ul");
        ul.className = "space-y-1 pl-2 border-l border-slate-800/60";

        const gridFolders = [
            "qa-infos",
            "qa-refs",
            "supabase",
            "arts",
            "mkt-campanhas",
            "anunciar-caminhao",
            "buscar-carga",
            "persona",
            "marca-transportador",
            "vantagem",
            "anunciar-carga",
            "buscar-caminhao",
            "persona-embarcador",
            "marca-embarcador",
            "vantagem-embarcador",
            "veb-assets",
            "veb-public",
            "veb-logo",
            "veb-mkt-1",
            "veb-mkt-2",
            "veb-mkt-3",
            "veb-painel",
            "posicionamento-digital",
            "pesquisa-cliente-forms",
            "benchmarking-produto",
            "netlify",
            "godaddy"
        ];

        nodes.forEach(node => {
            const li = document.createElement("li");
            const nodeDisplayLabel = node.label || node.name; // <--- PRIORIZA RÓTULO AMIGÁVEL

            if (node.type === "folder") {
                const isGridFolder = gridFolders.includes(node.name);

                const folderDiv = document.createElement("div");
                folderDiv.className = "flex items-center space-x-2 py-1.5 px-2 rounded cursor-pointer hover:bg-slate-800/60 text-slate-300 font-medium transition select-none text-xs";
                folderDiv.innerHTML = `
                    <i class="fa-solid fa-folder text-blue-400 text-xs"></i>
                    <span class="truncate" title="${nodeDisplayLabel}">${nodeDisplayLabel}</span>
                `;

                const childUlContainer = document.createElement("div");
                childUlContainer.className = "hidden";

                if (node.children && !isGridFolder) {
                    childUlContainer.appendChild(this.createTreeNodes(node.children));
                }

                folderDiv.addEventListener("click", (e) => {
                    e.stopPropagation();

                    if (isGridFolder) {
                        this.openFolderGrid(node);
                        return;
                    }

                    childUlContainer.classList.toggle("hidden");
                    const icon = folderDiv.querySelector("i");
                    if (icon) {
                        icon.classList.toggle("fa-folder");
                        icon.classList.toggle("fa-folder-open");
                    }
                });

                li.appendChild(folderDiv);

                if (!isGridFolder) {
                    li.appendChild(childUlContainer);
                }
            } else {
                const fileDiv = document.createElement("div");
                fileDiv.className = "tree-file-item flex items-center space-x-2 py-1 px-2 rounded cursor-pointer hover:bg-slate-800 hover:text-white text-slate-400 transition select-none text-[11px]";

                const iconClass = CONFIG.icons[node.ext] || CONFIG.icons.default || "fa-file";

                fileDiv.innerHTML = `
                    <i class="fa-solid ${iconClass}"></i>
                    <span class="truncate" title="${nodeDisplayLabel}">${nodeDisplayLabel}</span>
                `;

                fileDiv.addEventListener("click", (e) => {
                    e.stopPropagation();
                    document.querySelectorAll("#treeContainer div").forEach(el => {
                        el.classList.remove("bg-blue-600/20", "text-blue-300", "font-semibold", "active");
                    });
                    fileDiv.classList.add("bg-blue-600/20", "text-blue-300", "font-semibold", "active");
                    this.openFile(node);

                    this.closeMobileSidebar();
                });

                li.appendChild(fileDiv);
            }

            ul.appendChild(li);
        });

        return ul;
    }

    openFolderGrid(folder) {
        const folderTitle = folder.label || folder.name;
        const fileNameEl = document.getElementById("currentFileName");
        const filePathEl = document.getElementById("currentFilePath");
        const insightTextEl = document.getElementById("insightText");
        const fileTypeIconEl = document.getElementById("fileTypeIcon");

        if (fileNameEl) fileNameEl.textContent = folderTitle;
        if (filePathEl) filePathEl.textContent = `/${folder.path || folder.name}`;
        if (insightTextEl) insightTextEl.textContent = `Galeria com ${folder.children ? folder.children.length : 0} evidências e ativos visuais do diretório.`;

        if (fileTypeIconEl) {
            fileTypeIconEl.innerHTML = `<i class="fa-solid fa-folder-open text-blue-400"></i>`;
        }

        const container = document.getElementById("viewerContainer");
        if (!container) return;

        Renderers.renderFolderGrid(folder, container);
        this.closeMobileSidebar();
    }

    openFile(file) {
        this.currentSelectedFile = file;
        const fileTitle = file.label || file.name;

        const fileNameEl = document.getElementById("currentFileName");
        const filePathEl = document.getElementById("currentFilePath");
        const insightTextEl = document.getElementById("insightText");
        const fileTypeIconEl = document.getElementById("fileTypeIcon");

        if (fileNameEl) fileNameEl.textContent = fileTitle;
        if (filePathEl) filePathEl.textContent = `/${file.path}`;
        if (insightTextEl) insightTextEl.textContent = file.insight || "Ativo estratégico registrado no repositório da Volta Express.";

        if (fileTypeIconEl) {
            const iconClass = CONFIG.icons[file.ext] || CONFIG.icons.default || "fa-file";
            fileTypeIconEl.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
        }

        const container = document.getElementById("viewerContainer");
        if (!container) return;
        container.innerHTML = "";

        if (["pdf", "doc", "docx"].includes(file.ext)) this.renderDocumentFile(file);
        else if (file.ext === "img") Renderers.renderImage(file, container);
        else if (file.ext === "video") Renderers.renderVideo(file, container);
        else if (["js", "css", "json"].includes(file.ext)) Renderers.renderCode(file, container);
        else if (file.ext === "xlsx") Renderers.renderExcel(file, container);
        else Renderers.renderDefault(file, container);
    }

    renderDocumentFile(file) {
        const viewer = document.getElementById("viewerContainer");
        if (!viewer) return;

        if (file.ext === "pdf") {
            viewer.innerHTML = `
                <div class="w-full h-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm flex flex-col min-h-[600px]">
                    <iframe src="${file.path}" class="w-full h-full min-h-[600px]" frameborder="0"></iframe>
                </div>
            `;
            return;
        }

        if (file.ext === "doc" || file.ext === "docx") {
            viewer.innerHTML = `
                <div class="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
                    <i class="fa-solid fa-spinner fa-spin text-blue-600 text-lg"></i>
                    <span>Carregando e formatando documento...</span>
                </div>
            `;

            fetch(file.path)
                .then(response => {
                    if (!response.ok) throw new Error("Não foi possível carregar o arquivo.");
                    return response.arrayBuffer();
                })
                .then(arrayBuffer => {
                    if (!window.mammoth) {
                        throw new Error("Biblioteca de conversão (Mammoth.js) indisponível.");
                    }
                    return window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
                })
                .then(result => {
                    viewer.innerHTML = `
                        <div class="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-md border border-slate-200 my-4 text-slate-800 leading-relaxed font-sans prose prose-slate">
                            ${result.value}
                        </div>
                    `;
                })
                .catch(error => {
                    viewer.innerHTML = `
                        <div class="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200 text-center max-w-lg mx-auto my-8">
                            <i class="fa-solid fa-triangle-exclamation text-2xl mb-2 text-red-500"></i>
                            <p class="font-semibold text-sm">Erro ao carregar o documento.</p>
                            <p class="text-xs text-red-500 mt-1">${error.message}</p>
                        </div>
                    `;
                });
        }
    }

    setupSearch() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            if (!term) {
                this.renderTree(fileData);
                return;
            }

            function filterNodes(nodes) {
                return nodes.reduce((acc, node) => {
                    const matchLabel = node.label ? node.label.toLowerCase().includes(term) : false;
                    const matchName = node.name.toLowerCase().includes(term);
                    const matchInsight = node.insight ? node.insight.toLowerCase().includes(term) : false;

                    if (node.type === "file") {
                        if (matchName || matchLabel || matchInsight) {
                            acc.push(node);
                        }
                    } else if (node.children) {
                        const filteredChildren = filterNodes(node.children);
                        if (filteredChildren.length > 0 || matchName || matchLabel) {
                            acc.push({ ...node, children: filteredChildren });
                        }
                    }
                    return acc;
                }, []);
            }

            this.renderTree(filterNodes(fileData));
        });
    }

    closeMobileSidebar() {
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("mobileOverlay");
        if (sidebar && overlay && window.innerWidth < 768) {
            sidebar.classList.add("-translate-x-full");
            overlay.classList.add("hidden");
        }
    }

    setupMobileMenu() {
        const menuBtn = document.getElementById('mobileMenuBtn');
        const closeBtn = document.getElementById('closeSidebarBtn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobileOverlay');

        const openSidebar = () => {
            if (sidebar && overlay) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            }
        };

        const closeSidebar = () => {
            this.closeMobileSidebar();
        };

        if (menuBtn) menuBtn.addEventListener('click', openSidebar);
        if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
        if (overlay) overlay.addEventListener('click', closeSidebar);
    }

    openBenchmarkingItem(index) {
        const container = document.getElementById("viewerContainer");
        if (!container) return;

        if (index === 0) {
            Renderers.renderBenchmarkingDoc(container);
        } else if (index === 1) {
            Renderers.renderBenchmarkingVideo(container);
        }
    }
}