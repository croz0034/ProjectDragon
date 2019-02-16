let CreditWatch = {
    people: [],
    init: () => {
        let c = CreditWatch;
        c.parkPopulate(document.getElementById("Park"))
    document.getElementById('Back').addEventListener('click', ()=>{history.back()})
    },
    parkPopulate: (zone) => {
        //The northern empire is kingdom 31
        jsork.kingdom.getParks(31, (data) => {
            data.forEach((park) => {
                zone.innerHTML += `<option value="${park.ParkId}">${park.Name}</option>`;
            })
        });
        zone.addEventListener("change", CreditWatch.peoplePopulate)
    },
    peoplePopulate: (ev) => {
        let zone = document.getElementById("textOutput")
        jsork.park.getPlayers(ev.target.value, 0, function (data) {
            data.forEach((Player) => {
                CreditWatch.people.push({
                    "Name": Player.Persona,
                    "ID": Player.MundaneId
                });
            });
            console.log(CreditWatch.people)
            CreditWatch.Counter = CreditWatch.people.length;
            for (i = 0; i < CreditWatch.people.length; i++) {
                CreditWatch.personData(CreditWatch.people[i]);
            }
            document.getElementById("ClassFilter").addEventListener("change", CreditWatch.Display);
        });

    },
    personData: (person) => {
        jsork.player.getClasses(person.ID, function (data) {
            person.credits = data;
            CreditWatch.Counter--;
            if (CreditWatch.Counter == 0) {
                let RD = document.getElementById("ReadyIcon");
                RD.style.background = "lightgreen";
                RD.textContent = "Ready"
            }
        })
    },
    Display: (ev) => {
        let zone = document.getElementById("Content")
        let levels = [[0, 5], [5, 12], [12, 21], [21, 34], [34, 53], [53, 999]];
        let job = document.getElementById("ClassFilter").value;
        let threshHold = document.getElementById("TillNext").value;
        zone.innerHTML = "";

        CreditWatch.people.forEach((person) => {
            for (i = 0; i < person.credits.length; i++) {
                if (person.credits[i].class == job) {
                    let TilNext = levels[(person.credits[i].level - 1)][1] - (person.credits[i].credits)
                    if (TilNext < threshHold) {
                        console.log(`Person: ${person.Name} Credits: ${person.credits[i].credits} Required: ${levels[person.credits[i].level-1][1]} threshHold: ${threshHold}`)
                        zone.innerHTML += `<p> ${person.Name}: ${TilNext} </p>`
                    }
                }
            }
        })
    }
}

document.addEventListener('DOMContentLoaded', CreditWatch.init)
