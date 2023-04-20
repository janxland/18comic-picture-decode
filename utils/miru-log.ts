import packageInfo from "../package.json";
import { isClient } from "./is-client";
export function logMiruInfo() {
    if (!isClient()) {
        return;
    }
    const logo = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMTUgNTAiPgogIDxkZWZzPgogICAgPHN0eWxlPgogICAgICAuY2xzLTEgewogICAgICAgIGZpbGw6IG5vbmU7CiAgICAgICAgc3Ryb2tlOiAjMzMzOwogICAgICAgIHN0cm9rZS1saW5lY2FwOiByb3VuZDsKICAgICAgICBzdHJva2UtbGluZWpvaW46IHJvdW5kOwogICAgICAgIHN0cm9rZS13aWR0aDogNXB4OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBpZD0iZzEiPgogICAgPHBvbHlsaW5lIGlkPSJnZ2UyMzIiIGNsYXNzPSJjbHMtMSIgcG9pbnRzPSIyLjUgNDcuNSAyLjUgMi41IDIyLjUgMi41IDI3LjUgMTIuNSAzMi41IDIuNSA1Mi41IDIuNSA1Mi41IDQ3LjUgMzcuNSA0Ny41IDM3LjUgMTcuNSAyNy41IDMyLjUgMTcuNSAxNy41IDE3LjUgNDcuNSAyLjUgNDcuNSIvPgogICAgPHBvbHlsaW5lIGlkPSJnZ2UyMzUiIGNsYXNzPSJjbHMtMSIgcG9pbnRzPSI1Mi41IDE3LjUgNTIuNSA0Ny41IDgyLjUgNDcuNSA2Ny41IDE3LjUgNTIuNSAxNy41Ii8+CiAgICA8cG9seWxpbmUgaWQ9ImdnZTIzOCIgY2xhc3M9ImNscy0xIiBwb2ludHM9IjUyLjUgMi41IDUyLjUgMTcuNSA4Mi41IDE3LjUgODIuNSAyLjUgNTIuNSAyLjUiLz4KICAgIDxwb2x5bGluZSBpZD0iZ2dlMjQxIiBjbGFzcz0iY2xzLTEiIHBvaW50cz0iODIuNSAyLjUgODIuNSA0Ny41IDExMi41IDQ3LjUgMTEyLjUgMi41IDk3LjUgMi41IDk3LjUgMzIuNSA5Ny41IDIuNSA4Mi41IDIuNSIvPgogIDwvZz4KPC9zdmc+`;
    console.log(
        "%c ",
        `background: url(${logo}) no-repeat;background-size: 100% 100%;padding: 50px;`
    );
    console.log(
        `%c Miru v${packageInfo.version} %c https://miru.js.org `,
        "color: #fff;font-weight: 900;; background-color: rgb(246, 0, 78); padding:5px 0;",
        "background-color: rgb(255, 219, 219); padding:5px 0;"
    );
}
