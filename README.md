# La calor de les Festes de Castalla

Anàlisi climàtica de dos possibles calendaris de les Festes de Moros i Cristians de Castalla:

- **Període A:** de l’1 al 4 de setembre.
- **Període B:** últim divendres d’agost i els tres dies següents.

La pregunta és concreta: **quanta diferència de calor hi ha, de mitjana, entre els dos calendaris?** El projecte combina una comparació històrica de 1950–2025 amb projeccions climàtiques fins a 2100.

**[Obri la web interactiva](https://neurospeaker.github.io/calor-festes-castalla/)** · **[Descarrega tot el projecte (.zip)](https://github.com/neurospeaker/calor-festes-castalla/archive/refs/heads/main.zip)** · **[Consulta la versió estable](https://github.com/neurospeaker/calor-festes-castalla/releases/latest)** · **[Proposa una millora](https://github.com/neurospeaker/calor-festes-castalla/issues/new/choose)**

## Web interactiva

Consulta els resultats, els gràfics i la metodologia en la [web pública del projecte](https://neurospeaker.github.io/calor-festes-castalla/).

No cal instal·lar res: la web funciona directament en qualsevol navegador modern. Per a una còpia local, descarrega el repositori i obri `index.html` mitjançant un servidor web local, per exemple:

```bash
python3 -m http.server 8000
```

Després visita `http://localhost:8000`.

## Resultats principals

| Comparació | Resultat destacat |
| --- | ---: |
| Sèrie completa, 1950–2025 (76 anys) | B registra una temperatura mitjana **0,72 °C** superior a A |
| Anys sense cap dia coincident (43 anys) | La diferència mitjana B − A augmenta a **1,24 °C** |
| Dies amb màxima superior a 32 °C, sèrie completa | **14,5 %** en A i **32,9 %** en B |
| Dies amb màxima superior a 32 °C, sense solapament | **14,0 %** en A i **44,2 %** en B |

Les projeccions de 2027–2100 mantenen B com el període més calorós en la mediana dels quatre escenaris SSP analitzats. Són projeccions climàtiques, no pronòstics meteorològics d’una edició concreta.

## Arxius de dades i resultats

Els llibres d’Excel es publiquen amb noms estables, numerats i sense sufixos automàtics. Això facilita citar-los i mantindre enllaços permanents.

### Anàlisi històrica

| Arxiu | Contingut |
| --- | --- |
| [01 · Comparació climatològica 1950–2025](descarregues/historic/01_comparacio_climatologica_1950_2025.xlsx) | Sèrie anual i comparació descriptiva dels períodes A i B. |
| [02 · Anàlisi estadística 1950–2025](descarregues/historic/02_analisi_estadistica_1950_2025.xlsx) | Contrastos emparellats, intervals de confiança i comprovacions de robustesa. |
| [03 · Anàlisi estadística sense solapament](descarregues/historic/03_analisi_estadistica_sense_solapament_1950_2025.xlsx) | Replicació restringida als 43 anys en què A i B no compartixen cap dia. |
| [04 · Canvi recent 2020–2025](descarregues/historic/04_canvi_recent_2020_2025_vs_1950_2025.xlsx) | Comparació del període recent amb el conjunt històric. |
| [05 · Últims deu anys 2016–2025](descarregues/historic/05_ultims_10_anys_2016_2025_vs_1950_2025.xlsx) | Resultats de l’última dècada en context històric. |

### Projeccions climàtiques

| Arxiu | Contingut |
| --- | --- |
| [06 · Projecció climàtica 2027–2100](descarregues/projeccions/06_projeccio_climatica_2027_2100.xlsx) | Resultats de 11 models CMIP6 i quatre escenaris SSP. |
| [07 · Projecció climàtica sense solapament](descarregues/projeccions/07_projeccio_climatica_2027_2100_sense_solapament.xlsx) | Projecció aplicada als anys en què els dos calendaris no compartixen dies. |

Els textos preparats per a difusió estan en [difusio/Textos_publicacio_Castalla.md](difusio/Textos_publicacio_Castalla.md).

Per a descarregar els set Excel i la resta del projecte en un únic paquet, usa **[Descarrega tot el projecte (.zip)](https://github.com/neurospeaker/calor-festes-castalla/archive/refs/heads/main.zip)**. Les versions estables i les seues notes estan en [Releases](https://github.com/neurospeaker/calor-festes-castalla/releases).

## Metodologia resumida

- **Disseny:** comparació emparellada dins de cada any mitjançant la diferència B − A.
- **Variables històriques:** temperatura mitjana, màxima diürna, mínima nocturna i temperatura aparent.
- **Contrast principal:** t de Student bilateral sobre les diferències anuals, amb interval de confiança del 95 % i correcció de Holm per a quatre variables.
- **Robustesa:** bootstrap BCa, permutacions de signe, Wilcoxon, prova dels signes, Newey–West i bootstrap per blocs.
- **Projeccions:** 11 models CMIP6, escenaris SSP1-2.6, SSP2-4.5, SSP3-7.0 i SSP5-8.5, amb correcció QDM additiva calibrada en 1985–2014.

La metodologia completa i els límits d’interpretació es descriuen en la [web interactiva](https://neurospeaker.github.io/calor-festes-castalla/#metode).

## Fonts

- [ERA5-Land · Copernicus Climate Data Store](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-land)
- [Open-Meteo · Historical Weather API](https://open-meteo.com/en/docs/historical-weather-api)
- [AEMET · Projeccions climàtiques regionalitzades AR6](https://www.aemet.es/es/serviciosclimaticos/cambio_climat/proyecciones-AR6)
- [AdapteCCa · Catàleg de dades](https://escenarios.adaptecca.es/thredds/catalog/catalog.html)

Les dades històriques corresponen a Castalla (38,5964° N, 0,6722° O; 675 m). ERA5-Land és una reanàlisi i no substituïx una sèrie instrumental local independent.

## Autoria

**Lorenzo Díaz Mataix** — doctor en Neurociència i llicenciat en Farmàcia i Bioquímica.

Anàlisi plantejada, dirigida i interpretada per Lorenzo Díaz Mataix. S’han utilitzat eines d’intel·ligència artificial com a suport per a la programació, la visualització i la comunicació dels resultats.

## Com citar el projecte

> Díaz Mataix, L. (2026). *La calor de les Festes de Castalla: comparació climàtica de dos calendaris festius, 1950–2100* (versió 1.0). https://github.com/neurospeaker/calor-festes-castalla

GitHub també mostra una opció de citació automàtica a partir del fitxer [`CITATION.cff`](CITATION.cff).

## Contribuir

Qualsevol persona pot comunicar una errada, proposar una millora o enviar una *pull request*. La branca `main` està protegida i els canvis han de ser revisats abans de publicar-se.

- [Obri una issue amb la plantilla adequada](https://github.com/neurospeaker/calor-festes-castalla/issues/new/choose).
- Llig la [guia de contribució](CONTRIBUTING.md) abans d’enviar codi, dades o documentació.
- Comunica les vulnerabilitats en privat seguint la [política de seguretat](SECURITY.md).
- Consulta la [informació de privacitat i estadístiques d’ús](PRIVACY.md).
- Consulta el [registre de canvis](CHANGELOG.md) per veure l’evolució del projecte.

## Llicències i reutilització

El codi original es publica amb llicència MIT i els textos i visualitzacions originals amb CC BY 4.0. Les dades i els resultats derivats conserven les condicions dels seus proveïdors i no queden relicenciats. Consulta [LICENSE.md](LICENSE.md) per conéixer l’abast exacte i l’atribució recomanada.

---

Versió 1.0 · 25 de setembre de 2026
