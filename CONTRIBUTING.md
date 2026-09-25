# Com contribuir / Contributing

Gràcies per voler millorar **La calor de les Festes de Castalla**. Qualsevol persona pot comunicar errors, proposar millores o enviar canvis. La branca `main` està protegida: cap contribució externa es publica sense una revisió de [@neurospeaker](https://github.com/neurospeaker).

## Abans de començar

1. Consulta les [issues obertes](https://github.com/neurospeaker/calor-festes-castalla/issues) per evitar duplicats.
2. Per a una errada o proposta, usa la plantilla d’issue corresponent.
3. Per a una vulnerabilitat, seguix [SECURITY.md](SECURITY.md) i comunica-la en privat.

## Enviar un canvi

1. Fes un *fork* del repositori.
2. Crea una branca curta i descriptiva, per exemple `fix/etiqueta-grafic`.
3. Fes canvis limitats a un únic objectiu.
4. Executa:

   ```bash
   node --check app.js
   node scripts/check-site.mjs
   ```

5. Obri una *pull request* contra `main` i completa la plantilla.

Les correccions de dades, metodologia o interpretació han d’incloure una font verificable i, quan siga possible, passos reproduïbles. Els canvis visuals han d’aportar una captura. No inclogues dades personals, claus d’API ni altres secrets.

## Criteris de revisió

La revisió comprovarà:

- rigor de les dades i coherència amb la metodologia;
- claredat en valencià i accessibilitat de la web;
- funcionament dels enllaços, gràfics i descàrregues;
- compatibilitat amb les llicències i atribucions de les fonts;
- absència de secrets o informació personal.

La persona responsable pot demanar canvis, acceptar la contribució o tancar-la explicant-ne el motiu. Participar implica respectar el [Codi de conducta](CODE_OF_CONDUCT.md).

## English summary

Everyone is welcome to report issues, suggest improvements, or open a pull request. Please keep each contribution focused, cite verifiable sources for changes to data or methodology, run the two validation commands above, and complete the pull request template. The protected `main` branch requires review by the project owner before publication.

