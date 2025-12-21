# LMW Database UI

Frontend da plataforma LMW Database - Sistema de estruturas químicas moleculares desenvolvido pela UTFPR.

## 🚀 Tecnologias

- **React 19** - Framework frontend
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Docker** - Containerização

## 🧪 Sobre o Projeto

O LMW Database UI é a interface frontend para a plataforma de estruturas químicas moleculares, desenvolvida por estudantes da Universidade Tecnológica Federal do Paraná (UTFPR). A plataforma permite:

- ✅ Armazenamento de estruturas químicas
- ✅ Busca avançada por propriedades
- ✅ Visualização interativa 2D/3D
- ✅ Gestão de usuários e permissões
- ✅ Dashboard analítico

## 🔧 Instalação

### Desenvolvimento Local

```bash
# Clonar repositório
git clone https://gitlab.com/mei-u/lmw-database-ui.git
cd lmw-database-ui

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar servidor de desenvolvimento
npm run dev
```

### Docker

```bash
# Build da imagem
docker build -t lmw-database-ui .

# Executar container
docker run -p 3000:80 lmw-database-ui

# Ou usar docker-compose
docker-compose up
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Auth/           # Componentes de autenticação
│   └── Layout/         # Componentes de layout
├── pages/              # Páginas da aplicação
├── hooks/              # Custom hooks
├── services/           # Serviços (API, etc)
├── utils/              # Utilitários e helpers
└── assets/             # Assets estáticos
```

## 🔌 API Integration

O frontend se conecta com o backend Django através das seguintes rotas:

- `POST /users/register` - Cadastro de usuários
- `POST /users/login` - Login
- `GET /users` - Listar usuários (admin)
- `POST /users/<id>/set-admin/` - Promover a admin

## 🐳 Docker Compose

Para desenvolvimento integrado com backend:

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:80"
  backend:
    image: lmw-database-api:latest
    ports:
      - "8000:8000"
  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
```

## 🎨 Design System

- **Cores primárias**: Indigo/Blue
- **Tipografia**: Inter font
- **Componentes**: Tailwind CSS customizado
- **Responsividade**: Mobile-first
- **Tema**: Científico/acadêmico

## 📝 Scripts

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Linting com ESLint
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é desenvolvido como trabalho acadêmico na UTFPR.

## 👥 Equipe

Projeto desenvolvido por estudantes da UTFPR como parte do curso de Engenharia/Ciência da Computação.

---

**UTFPR - Universidade Tecnológica Federal do Paraná**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
