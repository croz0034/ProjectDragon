let HomeData = {
    DataReturned: {},
    user: {
        name: "Tryel",
        ID: 59484,
        Awards: {
            Other: []
        },
        Credits: {},
        Paragon: [],
        NonNobles: [],
        Belt: 0,
        Officers: {}
    },
    init: (ev) => {
        window.location.href.includes("#") ? HomeData.TranslateGet() :
            console.log('nada');
        Navigation.init();
        document.querySelector("#Tips").textContent = Tips[Math.floor(Math.random() * 20)];
    },
    TranslateGet: (ev) => {
        let url = window.location.href;
        url = url.split("#")
        let Raw
        if(url[1].includes("&&")){
          Raw = url[1].split("&&");
        } else {
            Raw = url[1].split("/")
        }
        Raw.forEach((argument) => {
            argument = argument.split("=");
            HomeData.user[argument[0]] = argument[1];
        })
        let data = JSON.parse(localStorage.getItem(HomeData.user.name))
        let currentDay = new Date;
        if (data && data.lastSeen <= (currentDay.getDate() + 3) && !(currentDay.getDate() > data.lastSeen)) {
            HomeData.user = data;
            HomeData.OfficerRig(true);
            HomeData.onScreen();
        } else {
            HomeData.OrkUpload();
        }
    },
    OrkUpload: () => {
        HomeData.LevelRig();
        HomeData.AwardRig();
        HomeData.OfficerRig(false);

    },
    OfficerRig: (HasData) => {

        if (!HasData) {
            jsork.player.getInfo(HomeData.user.ID, (data) => {
                jsork.park.getOfficers(data.ParkId, (data) => {
                    let zone = document.getElementById("Officers")
                    zone.innerHTML = ""
                    console.log(data);
                    document.querySelector(".Citizen").textContent = `Citizen of ${data[0].ParkName}`;

                    HomeData.user.Park = data.ParkName
                    data.forEach((officer) => {
                        console.log(officer);
                        zone.innerHTML += `<p><strong>${officer.OfficerRole}:</strong> ${officer.Persona}`
                        console.log(officer)
                        HomeData.user.Officers[officer.OfficerRole] = officer.Persona;
                        console.log(HomeData.user.Officers);

                        HomeData.DataReturned.officers = true;
                        if (HomeData.DataReturned.Levels && HomeData.DataReturned.Awards) {
                            HomeData.DataReturned = {};
                            HomeData.fetchDone()
                        }
                    })
                })
            })
        } else {
            let zone = document.getElementById("Officers")
            zone.innerHTML = ""
            data = HomeData.user.Officers
            document.querySelector(".Citizen").textContent = `Citizen of ${HomeData.user.Park}`;
            console.log(HomeData.user)
            Object.keys(data).forEach((officer) => {
                zone.innerHTML += `<p><strong>${officer}:</strong> ${data[officer]}`;
                console.log(officer);
            })
        }
    },
    LevelRig: () => {
        jsork.player.getClasses(HomeData.user.ID, (data) => {
            console.log(data)
            let levels = [[0, 5], [5, 12], [12, 21], [21, 34], [34, 53], [53, 999]];
            data.forEach((job) => {
                let zone = HomeData.user.Credits;
                zone[job.class] = {
                    level: job.level,
                    bar: (job.credits - levels[job.level - 1][0]) / (levels[job.level - 1][1] - levels[job.level - 1][0]),
                    credits: job.credits,
                    next: levels[job.level - 1][1]
                };
                if (job.level == 6) {
                    zone[job.class].bar = 1;
                }
            })

            HomeData.DataReturned.Levels = true;
            if (HomeData.DataReturned.officers && HomeData.DataReturned.Awards) {
                HomeData.DataReturned = {};
                HomeData.fetchDone();
            }
        })


    },
    AwardRig: () => {
        jsork.player.getAwards(HomeData.user.ID, 9999, (data) => {
            console.log(data);
            data.forEach((Award) => {
                let zone = HomeData.user.Awards;
                switch (Award.KingdomAwardName) {
                    case "Order of the Dragon":
                        zone.Dragon ? zone.Dragon++ : zone.Dragon = 1;
                        break;
                    case "Order of the Rose":
                        zone.Rose ? zone.Rose++ : zone.Rose = 1;
                        break;
                    case "Order of the Griffin":
                        zone.Gryphon ? zone.Gryphon++ : zone.Gryphon = 1;
                        break;
                    case "Order of the Garber":
                        zone.Garber ? zone.Garber++ : zone.Garber = 1;
                        break;
                    case "Order of the Smith":
                        zone.Smith ? zone.Smith++ : zone.Smith = 1;
                        break;
                    case "Order of the Warrior":
                        zone.Warrior ? zone.Warrior++ : zone.Warrior = 1;
                        break;
                    case "Order of the Lion":
                        zone.Lion ? zone.Lion++ : zone.Lion = 1;
                        break;
                    case "Order of the Owl":
                        zone.Owl ? zone.Owl++ : zone.Owl = 1;
                        break;
                    default:
                        zone.Other.push(Award);
                }
            })
            HomeData.DataReturned.Awards = true;
            if (HomeData.DataReturned.officers && HomeData.DataReturned.Levels) {
                HomeData.DataReturned = {};
                HomeData.fetchDone()
            }

        });

    },
    fetchDone: () => {
        HomeData.user.lastSeen = new Date().getDate()
        console.log(HomeData.user)
        localStorage.setItem(HomeData.user.name, JSON.stringify(HomeData.user));

        console.log(JSON.parse(localStorage.getItem(HomeData.user.name)))
        HomeData.onScreen();
    },
    onScreen: () => {
        Object.keys(HomeData.user.Credits).forEach((job) => {
            HomeData.xpBarPopulate(job)
        });

        Object.keys(HomeData.user.Awards).forEach((order) => {
            HomeData.ladderPopulate(order)
        })

    },
    xpBarPopulate: (job) => {
        let SashColour = {
            "Assassin": "Black",
            "Barbarian": "White",
            "Monk": "Grey",
            "Scout": "Green",
            "Warrior": "Purple",
            "Bard": "Blue",
            "Druid": "Brown",
            "Healer": "Red",
            "Wizard": "Yellow",
            "Archer": "Orange",
        }
        let zone = document.querySelector(`.${job}`)
        SashColour[job] ?
            zone.querySelector(".colour").style.backgroundColor = SashColour[job] : console.log(job);
        zone.querySelector(".Bar").style.width = `${(HomeData.user.Credits[job].bar * 100)}%`;
        zone.querySelector(".Contents").textContent = `${HomeData.user.Credits[job].level} ${job} ${HomeData.user.Credits[job].credits}`

        if (HomeData.user.Credits[job].level < 6) {
            zone.querySelector(".Contents").textContent += `/ ${HomeData.user.Credits[job].next}`
        }

    },
    ladderPopulate: (order) => {
        let zone = document.querySelector(".Ladder")
        zone = zone.querySelector(`.` + order)
        if (zone) {
            let targets = zone.querySelectorAll(".LadderBubble");
            for (i = 0; i < 10; i++) {
                (i < HomeData.user.Awards[order]) ? targets[i].style.background = "lightblue": targets[i].style.background = "white";
            }
        } else if (order == "Other") {
            zone = document.querySelector(".MiscZone");
            console.log("Tracer Round")
            console.log(order)
            HomeData.OtherPopulate();
        }

    },
    OtherPopulate: () => {
        let NobleTitle = {
            ESQUIRE: 50,
            MASTER: 51,
            LORD: 52,
            LADY: 53,
            BARONET: 54,
            BARONETESS: 55,
            BARON: 56,
            BARONESS: 57,
            VISCOUNT: 58,
            VISCOUNTESS: 59,
            COUNT: 60,
            COUNTESS: 61,
            MARQUIS: 62,
            MARQUESS: 63,
            DUKE: 64,
            DUCHESS: 65,
            ARCHDUKE: 66,
            ARCHDUCHESS: 67,
            GRAND_DUKE: 68,
            GRAND_DUCHESS: 69
        };
        let belt = {
            "Man-at-Arms": 1,
            "Page": 0,
            Squire: 2,
            0: "Page",
            1: "Man-at-Arms",
            2: "Squire"
        }
        let awards = HomeData.user;
        awards.Awards.Other.forEach((item) => {
            if (NobleTitle[item.KingdomAwardName.toUpperCase()]) {
                awards.NobleTitle = item.KingdomAwardName;
            } else if (item.KingdomAwardName.includes("Paragon")) {
                awards.Paragon.push(item.KingdomAwardName)
            } else if (item.CustomAwardName == "Non noble" || item.Note.includes("Non-Noble")) {
                item.Note.includes("Non-Noble") ? item.Note = item.Note.match(/"([^"]+)"/)[1] : console.log('carry on');
                awards.NonNobles.push(item.Note);
            } else if (belt[item.KingdomAwardName]) {
                awards.Belt = Math.max(awards.Belt, belt[item.KingdomAwardName])
                document.querySelector(".Master").textContent = `${item.GivenBy}'s ${belt[awards.Belt]}`;
            } else {
                console.log(item)
                document.querySelector(".MiscZone").innerHTML += `<p><strong>${item.KingdomAwardName}</strong> ${item.Note}</p>`;

            }


        })

        document.querySelector(".NobleTitle").textContent = awards.NobleTitle;
        document.querySelector(".UserName").textContent = awards.name;
        document.querySelector(".Paragon").textContent = awards.Paragon.join(", ");
        document.querySelector(".NonNobles").textContent = awards.NonNobles.join(", ");
    }
}


let Navigation = {
    start: "Title",
    pages: [],
    init: () => {
        let x = 0
        let Items = document.querySelectorAll(".Page").length
        document.querySelectorAll(".Page").forEach((page) => {
            Navigation.pages.push(page);
            page.classList.add("hidden")
            let additions = document.createElement("button");
            additions.textContent = page.classList[1];
            additions.id = page.classList[1];
            additions.style.width = `${100*(1/Items)}vw`;
            additions.style.marginLeft = `${(100*(1/Items)*x)}vw`;
            additions.addEventListener('click', Navigation.Navigate);
            document.querySelector("nav").appendChild(additions);
            x++;
        })

        document.querySelector(`.${Navigation.start}`).classList.remove("hidden")
        document.querySelector(`#${Navigation.start}`).classList = "active"

    },
    Navigate: (ev) => {
        Navigation.pages.forEach((page) => {
            page.classList.add("hidden")
            document.getElementById(page.classList[1]).classList = "";
        });

        ev.target.classList = "active";
        document.querySelector(`.${ev.target.id}`).classList.remove("hidden")
        document.querySelector("#Tips").textContent = Tips[Math.floor(Math.random() * 20)];
    }
}
const Tips = [
"Throw your shield at engulfing spell balls to block their effect (p19)", "A stopped player may not use blink, teleport, or be affected by lost or banish (p52)",
"Extraordinary abilities (marked with (ex)) do not require a free hand and are not stopped by pro-mag or void touched (p48)",
"Force bolts will still destroyed hardened weapons, or monks below the level of 6 (p59, 61)",
"Undead minions are tricky to deal with. If you can't kill them, kill their healer. Doing so will stop them from coming back (p59, 66)",
"Sanctuary, and insubstantial stop the player who is using them from (impeding play) and (physically interracial with other players) respectively. (P52, 63)",
"You may use release on hostile players as long as they are incapable of moving or engaging in combat… remember this when someone uses shadow step (p50)",
"A dead leg is only an invalid target while it's knee is in contact with the ground or during its initial placement (p6)",
"players who move after dieing may not be resurrected (p7). Unless they are summoned first (p65)",
"If a weapon or shield is destroyed, you may repair it after 60 seconds at base (p24)",
"Even if your opponent is wounded or killed, you aren't safe yet! Any shot they were throwing still has a chance to connect within a ½ second (p7)",
"(Ex) extraordinary enchantments don't take up your enchant slots, or interfere with (m) enchantments in any way (p29, 48)",
"If you want an attuned from a druid, find them a scout with evolution. Most druids won't waste the points on a spell they don't intend to use (p57)",
"Teleport and lost only force movement as long as the effected player is insubstantial. Use tracking or shake it off creatively (p60,66)",
"Great weapons with 18” of heavy padding (4” cross section) gain the armour breaking and shield crushing traits regardless of class using them. (P18)",
"Gift of air is susceptible to magic, or melee armour breaking or shield crushing. Consult your local Barbarian (p33, 58)",
"All effects from 'poison’ are considered magical. A protection from magic, or void touched could save your life (p49)",
"you can use frozen or insubstantial to become immune to more dangerous spells, lord T calls this 'shadow dancing’ (p51, 52)",
"magic requires a free hand to cast. Luckily a small shield does not need to be held in hand to be wielded (p19, 49)",
"Fight after death, elemental barrage, and sanctuary are all ongoing effects. In the right circumstances a greater / release can do wonders (p51)",

];

document.addEventListener("DOMContentLoaded", HomeData.init)
