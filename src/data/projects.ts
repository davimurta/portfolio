import { Project, ApiResponse } from '@/types'

export const projectsData: Project[] = [
  {
    id: '1',
    slug: 'e-commerce-platform',
    title: 'E-Commerce Platform',
    description: 'Uma plataforma completa de e-commerce com carrinho, checkout e painel administrativo integrado.',
    fullDescription: `
      Este projeto é uma plataforma de e-commerce completa desenvolvida com as mais modernas tecnologias do mercado.

      ## Funcionalidades Principais

      - **Carrinho de Compras**: Sistema completo com persistência, cálculo de frete e cupons de desconto
      - **Checkout Integrado**: Integração com Stripe para pagamentos seguros
      - **Painel Administrativo**: Dashboard completo para gestão de produtos, pedidos e clientes
      - **Autenticação**: Sistema de login com OAuth e JWT

      ## Tecnologias Utilizadas

      O projeto foi construído utilizando Next.js 14 com App Router, TypeScript para tipagem estática,
      Tailwind CSS para estilização e Stripe para processamento de pagamentos.

      ## Desafios e Soluções

      Um dos principais desafios foi implementar um sistema de carrinho que funcionasse tanto para
      usuários autenticados quanto para visitantes, mantendo a sincronização entre dispositivos.
    `,
    tags: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS'],
    image: '/images/project-1.jpg',
    gallery: ['/images/project-1.jpg', '/images/project-1-2.jpg', '/images/project-1-3.jpg'],
    liveUrl: 'https://ecommerce-demo.com',
    githubUrl: 'https://github.com/davimurta/ecommerce',
    featured: true,
    category: 'web',
    createdAt: '2025-12-01'
  },
  {
    id: '2',
    slug: 'fitness-tracking-app',
    title: 'Fitness Tracking App',
    description: 'Aplicativo mobile para rastreamento de exercícios e nutrição com sincronização em tempo real.',
    fullDescription: `
      Aplicativo mobile desenvolvido para ajudar usuários a acompanhar seus treinos e alimentação de forma simples e intuitiva.

      ## Funcionalidades Principais

      - **Rastreamento de Exercícios**: Registro detalhado de treinos com séries, repetições e peso
      - **Plano Nutricional**: Controle de macros e calorias diárias
      - **Sincronização em Tempo Real**: Dados sincronizados instantaneamente entre dispositivos
      - **Gráficos de Progresso**: Visualização da evolução ao longo do tempo

      ## Tecnologias Utilizadas

      Desenvolvido com React Native e Expo para máxima compatibilidade, Firebase para backend
      e sincronização em tempo real, e Redux para gerenciamento de estado.
    `,
    tags: ['React Native', 'Firebase', 'Expo', 'Redux'],
    image: '/images/project-2.jpg',
    gallery: ['/images/project-2.jpg'],
    liveUrl: 'https://play.google.com/store/apps/fitness-app',
    githubUrl: 'https://github.com/davimurta/fitness-app',
    featured: true,
    category: 'mobile',
    createdAt: '2025-10-15'
  },
  {
    id: '3',
    slug: 'task-management-dashboard',
    title: 'Task Management Dashboard',
    description: 'Dashboard moderno para gerenciamento de tarefas e projetos com colaboração em equipe.',
    fullDescription: `
      Sistema de gerenciamento de tarefas e projetos com foco em colaboração e produtividade.

      ## Funcionalidades Principais

      - **Kanban Board**: Organização visual de tarefas com drag and drop
      - **Colaboração em Tempo Real**: Múltiplos usuários editando simultaneamente
      - **Notificações**: Sistema de alertas e lembretes
      - **Relatórios**: Métricas de produtividade e progresso

      ## Tecnologias Utilizadas

      Stack MERN com React no frontend, Node.js e Express no backend, MongoDB para persistência
      e Socket.io para comunicação em tempo real.
    `,
    tags: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    image: '/images/project-3.jpg',
    gallery: ['/images/project-3.jpg'],
    liveUrl: 'https://taskboard-demo.com',
    githubUrl: 'https://github.com/davimurta/taskboard',
    featured: false,
    category: 'web',
    createdAt: '2025-08-20'
  },
  {
    id: '4',
    slug: 'real-estate-marketplace',
    title: 'Real Estate Marketplace',
    description: 'Marketplace de imóveis com busca avançada, filtros e sistema de agendamento de visitas.',
    fullDescription: `
      Plataforma completa para compra, venda e aluguel de imóveis com recursos avançados de busca e agendamento.

      ## Funcionalidades Principais

      - **Busca Avançada**: Filtros por localização, preço, área e características
      - **Mapa Interativo**: Visualização de imóveis no mapa com Google Maps API
      - **Agendamento de Visitas**: Sistema integrado de agendamento com notificações
      - **Chat em Tempo Real**: Comunicação direta entre compradores e vendedores

      ## Tecnologias Utilizadas

      Next.js para o frontend com SSR, PostgreSQL com Prisma ORM para o banco de dados,
      e integração com Google Maps API para geolocalização.
    `,
    tags: ['Next.js', 'PostgreSQL', 'Maps API', 'Prisma'],
    image: '/images/project-4.jpg',
    gallery: ['/images/project-4.jpg'],
    liveUrl: 'https://realestate-demo.com',
    featured: false,
    category: 'web',
    createdAt: '2025-06-10'
  },
  {
    id: '5',
    slug: 'social-media-analytics',
    title: 'Social Media Analytics',
    description: 'Ferramenta de análise de métricas para redes sociais com visualização de dados interativa.',
    fullDescription: `
      Dashboard analítico para monitoramento e análise de métricas de redes sociais.

      ## Funcionalidades Principais

      - **Multi-plataforma**: Integração com Instagram, Twitter, Facebook e LinkedIn
      - **Gráficos Interativos**: Visualizações dinâmicas com Chart.js
      - **Relatórios Automatizados**: Geração de PDFs com métricas semanais/mensais
      - **Comparativos**: Análise de concorrentes e benchmarking

      ## Tecnologias Utilizadas

      React para interface, Chart.js para visualizações, integração com APIs das
      principais redes sociais e Material UI para componentes.
    `,
    tags: ['React', 'Chart.js', 'REST API', 'Material UI'],
    image: '/images/project-5.jpg',
    gallery: ['/images/project-5.jpg'],
    liveUrl: 'https://analytics-demo.com',
    featured: false,
    category: 'web',
    createdAt: '2025-04-05'
  }
]

// Função para buscar projeto por slug (usada nas páginas dinâmicas)
export const getProjectBySlug = async (slug: string): Promise<ApiResponse<Project | null>> => {
  const project = projectsData.find(p => p.slug === slug)

  return {
    data: project || null,
    success: !!project,
    message: project ? undefined : 'Project not found'
  }
}
