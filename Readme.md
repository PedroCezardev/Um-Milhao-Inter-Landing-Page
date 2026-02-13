# 🧡 Banco Inter - High-Conversion Landing Page Concept

> Uma landing page conceitual, interativa e de altíssima conversão desenvolvida para prospecção, criação de conteúdo e demonstração de UI/UX premium no setor financeiro.

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Tech](https://img.shields.io/badge/Tech-Vanilla_JS_|_Tailwind_|_GSAP-orange)

## 🎯 Sobre o Projeto
Este projeto foi construído com um objetivo claro: **vender**. Fugindo dos templates tradicionais, esta landing page utiliza gatilhos visuais de alto impacto, retenção de atenção e engenharia de front-end avançada para transformar tráfego em leads qualificados.

O design foi intencionalmente pensado para manter o foco do usuário na "cópia" (texto de vendas), utilizando fundos dinâmicos que não competem com a mensagem principal e animações atreladas ao scroll que guiam a leitura do início ao fim.

## 🚀 Principais Features & Engenharia

* **Fundo 3D Customizado (WebGL/Three.js):** Um grid infinito com scanner a laser projetado via shaders. Otimizado para ser estático (sem interações pesadas de mouse) garantindo máxima performance e foco total na mensagem de conversão.
* **Animações "Apple-Style" (GSAP + ScrollTrigger):** * **Scroll Reveal com Blur:** Textos que se revelam e desembaçam perfeitamente sincronizados com a velocidade do scroll do usuário (efeito *scrubbing*).
    * **Sticky Scroll Typography:** Um componente de caça-níquel vertical (Slot Machine Effect) que prende a tela e troca adjetivos de alto impacto de forma elástica, mantendo o usuário engajado.
* **Smooth Scrolling Avançado:** Implementação do `Lenis` para garantir uma rolagem macia e premium, fundamental para o funcionamento perfeito das animações de gatilho.
* **Footer Premium (Dark Mode):** Rodapé desenhado com Flexbox moderno, selos de segurança, links organizados e um CTA flutuante irresistível para o fechamento da jornada do usuário.
* **100% Responsivo e Otimizado:** Construído com as classes dinâmicas do Tailwind CSS via CDN, garantindo fluidez desde telas ultra-wide até dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando uma stack moderna, leve e sem dependência de frameworks pesados, focando em performance pura:

* **HTML5 / CSS3 / JavaScript (Vanilla)**
* **Tailwind CSS** (via CDN para estilização rápida e utilitária)
* **GSAP (GreenSock) & ScrollTrigger** (Core das animações baseadas em scroll)
* **Three.js & Postprocessing** (Renderização do grid 3D e efeitos de aberração/bloom)
* **Lenis** (Motor de scroll suave)
* **Lucide Icons & Bootstrap Icons** (Iconografia moderna e escal