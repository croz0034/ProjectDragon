let initAll = () => {
    speechModule.init();
    earModule.init();
    document.getElementById('Back').addEventListener('click', () => {
        history.back()
    })
}
let speechModule = {
    synth: "",
    init: (ev) => {
        let s = speechModule;
        s.synth = window.speechSynthesis;
    },
    Parrot: (ev) => {
        console.log(ev.target);
        let WhatToSay;
        if (ev.target) {
            WhatToSay = new SpeechSynthesisUtterance(ev.target.textContent)
        } else {
            WhatToSay = new SpeechSynthesisUtterance("I can't let you do that, Dave");
        }
        speechModule.synth.speak(WhatToSay);
    },
    listen: (ev) => {
        let s = speechModule;

    }
}
let earModule = {
    // Recognition stuff
    SpeechRecognition: webkitSpeechRecognition,
    SpeechGrammarList: webkitSpeechGrammarList,
    SpeechRecognitionEvent: webkitSpeechRecognitionEvent,
    recognition: "",
    grammar: '#JSGF V1.0; grammar Swears; public <swear> = awe ;',

    init: () => {
        document.getElementById("textOutput").addEventListener('click', speechModule.Parrot)
        let e = earModule;
        e.recognition = new e.SpeechRecognition();
        var speechRecognitionList = new e.SpeechGrammarList();

        speechRecognitionList.addFromString(e.grammar, 0);

        e.recognition.grammars = speechRecognitionList;
        e.recognition.continuous = true;
        e.recognition.lang = 'en-US';
        e.recognition.interimResults = false;
        e.recognition.maxAlternatives = 5;

        document.getElementById("Microphone").addEventListener('click', e.listen)

    },
    listen: () => {
        earModule.recognition.start();
        let drop = document.getElementById("Microphone")
        drop.classList.add("active");
        drop.textContent = "Listening";
        earModule.recognition.onresult = function (event) {
            let result = event.results[(event.results.length - 1)][0].transcript.toLowerCase();
            console.log(event.results[(event.results.length - 1)])
            console.log(result)

            for (i = 0; i < abilities.length; i++) {
                let spell = abilities[i];
                if (result.includes(spell.name.toLocaleLowerCase())) {

                    spell.type = `${spellType[spell.type]}`;
                    spell.school = `${spellSchool[spell.school]}`;
                    spell.incant = `"${spell.incant[0]}" X ${spell.incant[1]}`;
                    spell.range = `${spellRange[spell.range]}`;
                    spell.materials = `${spell.materials[0]}  ${spellMaterials[spell.materials[1]]}`;

                    let c = earModule.ContentFill;
                    document.querySelectorAll(".OverZone").forEach((Element) => {
                        c(Element.id, spell)
                    })
                    return "done"
                } else {
                    console.log("nope")
                }
            }

        }
        earModule.recognition.onend = () => {
            drop.classList.remove("active");
            drop.textContent = "Begin";
        }
    },
    ContentFill: (target, spell) => {
        let targetzone = document.querySelector(`#${target}`)
        console.log(targetzone.childNodes)
        if (spell[target]) {
            targetzone.classList.remove("hidden")
            console.log(spell[target])
            if (Array.isArray(spell[target])) {
                spell[target] = spell[target].join("<br>");

                console.log(spell[target])
            }
            targetzone.querySelector(".Mutable").innerHTML = spell[target]
        } else {
            targetzone.classList.add("hidden")
        }
    }
}

document.addEventListener("DOMContentLoaded", initAll)
