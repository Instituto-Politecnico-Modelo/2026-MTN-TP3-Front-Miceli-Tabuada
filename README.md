# 🖥️ TP3 — Frontend

![Status](https://img.shields.io/badge/status-en%20proceso-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 📌 Descripción

Este repositorio contiene la parte **frontend** del TP3.  
La aplicación está construida con **React + TypeScript + Vite** y se conectará con un backend desarrollado en **Spring Boot**.

> ⚠️ **Proyecto en proceso** — algunas funcionalidades pueden estar incompletas o sujetas a cambios.

---

## 🔗 Repositorio Backend

El backend de este proyecto se encuentra en:  
👉 [2026-MTN-TP3-Back-Miceli-Tabuada](https://github.com/Instituto-Politecnico-Modelo/2026-MTN-TP3-Back-Miceli-Tabuada)

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| ⚛️ React 19 | UI |
| 🟦 TypeScript | Tipado estático |
| ⚡ Vite | Bundler / Dev server |
| 🐳 Docker | Containerización |
| 🔀 React Router | Navegación |

---

## 🐳 Docker

El proyecto incluye dos Dockerfiles:

- **`Dockerfile`** — Multi-stage: construye la app y la sirve con nginx.
- **`Dockerfile.single`** — Single-stage: construye y sirve con `vite preview`.

```bash
# Multi-stage
docker build -t tp3-front .

# Single-stage
docker build -f Dockerfile.single -t tp3-front-dev .
```

---

## 🚀 Levantar en desarrollo

```bash
npm install
npm run dev
```

La app corre en `http://localhost:5173` y redirige las peticiones `/api` al backend en `http://localhost:8081`.

---

## 👥 Equipo

### 🎓 Alumnos
| Nombre | Rol |
|---|---|
| Francisco Miceli | Alumno |
| Lorenzo Tabuada | Alumno |

### 👨‍🏫 Docentes
| Nombre |
|---|
| Nicolás Pruscino |
| Martín Barbieri |
| Magali Cristobo |

