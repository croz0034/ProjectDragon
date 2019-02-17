//const tryel = {name: "Tryel", ID:59484}
//const person = "#name=Tryel&&ID=59484";
//#name=Skye&&ID=59483
let HomeData = {
        DataReturned: false,
        user: {
            name: "Tryel",
            ID: 59484,
            Awards: {
                Other: []
            },
            Credits: {},
            Paragon: [],
            NonNobles: []
        },
        init: (ev) => {
            window.location.href.includes("#") ? HomeData.TranslateGet() :
                HomeData.OrkUpload();;
            Navigation.init();
        },
        TranslateGet: (ev) => {
            let url = window.location.href;
            url = url.split("#")
            let Raw = url[1].split("&&");
            Raw.forEach((argument) => {
                argument = argument.split("=");
                HomeData.user[argument[0]] = argument[1];
            })
            let data = JSON.parse(localStorage.getItem(HomeData.user.name))
            let currentDay = new Date;
            if (data && data.lastSeen <= (currentDay.getDate() + 3)) {
                HomeData.user = data;
                HomeData.onScreen();
            } else {
                HomeData.OrkUpload();
            }
        },
        OrkUpload: () => {
            HomeData.LevelRig();
            HomeData.AwardRig();

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

                HomeData.DataReturned ? HomeData.fetchDone() : HomeData.DataReturned = true;
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
                HomeData.DataReturned ? HomeData.fetchDone() : HomeData.DataReturned = true;

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
            zone.querySelector(".Contents").textContent = `${HomeData.user.Credits[job].level} ${job} ${HomeData.user.Credits[job].credits} / ${HomeData.user.Credits[job].next}`

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

                HomeData.OtherPopulate();
            }

        },
        OtherPopulate: (AwardArray) => {
            let NobleTitle = {
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
            }
            let awards = HomeData.user;
            awards.Awards.Other.forEach((item) => {
                console.log(item)
                    if (NobleTitle[item.KingdomAwardName.toUpperCase()]) {
                        awards.NobleTitle = item.KingdomAwardName;
                    } else if (item.KingdomAwardName.includes("Paragon")) {
                        awards.Paragon.push(item.KingdomAwardName)
                    } else if (item.CustomAwardName == "Non noble") {
                        awards.NonNobles.push(item.Note);
                        }
                        else {
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
            start: "Ladder",
            pages: [],
            init: () => {
                let x = 0
                document.querySelectorAll(".Page").forEach((page) => {
                    Navigation.pages.push(page);
                    page.classList.add("hidden")
                    let additions = document.createElement("button");
                    additions.textContent = page.classList[1];
                    additions.style.left = `${10 * x}vh`;
                    additions.addEventListener('click', (ev) => {
                        Navigation.pages.forEach((page) => {
                            page.classList.add("hidden")
                        });
                        page.classList.remove("hidden")
                    });
                    document.querySelector("nav").appendChild(additions);
                    x++;
                })

                document.querySelector(`.${Navigation.start}`).classList.remove("hidden")

            }
        }

        document.addEventListener("DOMContentLoaded", HomeData.init)
