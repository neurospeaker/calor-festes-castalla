# La calor de les Festes de Castalla

Anàlisi climàtica de dos possibles calendaris de les Festes de Moros i Cristians de Castalla:

- **Període A:** de l’1 al 4 de setembre.
- **Període B:** últim divendres d’agost i els tres dies següents.

La pregunta és concreta: **quanta diferència de calor hi ha, de mitjana, entre els dos calendaris?** El projecte combina una comparació històrica de 1950–2025 amb projeccions climàtiques fins a 2100.

## Web interactiva

Consulta els resultats, els gràfics i la metodologia en la [web pública del projecte](https://neurospeaker.github.io/calor-festes-castalla/).

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

## Reutilització

Els conjunts de dades d’origen conserven les seues condicions d’ús i atribució. Qualsevol reutilització dels resultats ha d’identificar este projecte i citar també els proveïdors de dades corresponents. No s’ha incorporat una llicència general al repositori per evitar atribuir als materials d’origen unes condicions diferents de les seues.

---

Versió 1.0 · 25 de setembre de 2026
