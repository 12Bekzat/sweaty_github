var imageSources = [
    'https://static.wixstatic.com/media/a3c153_6f27754e06844d62a1708b316797fc08~mv2.jpg/v1/fill/w_673,h_315,al_c,q_80,usm_0.66_1.00_0.01/marbel.webp',
    'https://static.wixstatic.com/media/a3c153_4c9ff7f594c1414f9f7894e514098894~mv2.jpg/v1/fill/w_673,h_315,al_c,q_80,usm_0.66_1.00_0.01/11062b_fd5c21cdc57f4b19b00f8ec0988396fe_.webp',
    'https://static.wixstatic.com/media/a3c153_c3a1f52d22f34ebf807575c44a0b3c46~mv2.jpg/v1/crop/x_0,y_0,w_2686,h_1261/fill/w_673,h_315,al_c,q_80,usm_0.66_1.00_0.01/hasan-almasi-nKNm_75lH4g-unsplash%20Copy_j.webp'
];

class User {
    constructor(id, firstname, secondname, email, password) {
        this.id = id;
        this.firstname = firstname;
        this.secondname = secondname;
        this.email = email;
        this.password = password;
    }

    getFullname() {
        return this.firstname + ' ' + this.secondname;
    }
}

class Project {
    constructor(id, name, type, src, user, comments, isPrivate, likes, dislikes) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.mainText = ' ';
        this.src = src;
        this.user = user;
        this.comments = comments;
        this.isPrivate = isPrivate;
        this.likes = likes;
        this.dislikes = dislikes;
    }
}

class Comment {
    constructor(id, user, text) {
        this.id = id;
        this.user = user;
        this.text = text;
    }
}

class Team {
    constructor(projectId, users) {
        this.projectId = projectId;
        this.users = users;
    }
}

var users = [];
var currentUser = -1;
var projects = [];
var teams = [];
var currentProject = -1;

function isExist(email) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].email == email) {
            return true;
        }
    }

    return false;
}

function addProject() {
    if (currentUser == -1) return;
    var name = document.getElementById('create-name');
    var type = document.getElementById('create-type');

    if (name.value == '' || type.value == '') return;

    var pr = new Project(projects.length, name.value, type.value, imageSources[Math.floor(Math.random() * 3)], currentUser, [], false, [], []);

    projects.push(pr);

    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('currentProject', projects.length - 1);
    window.location.href = 'works.html';
}

function login(email, password) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].email == email && users[i].password == password) {
            return i;
        }
    }

    return -1;
}

function logInAccount() {
    console.log(users[0]);
    var email = document.getElementById('log-in-email');
    var password = document.getElementById('log-in-password');
    if (email.value == '' || password.value == '') {
        document.getElementById("error").textContent = "Please enter correct data";
        return;
    }
    if (isExist(email.value) && login(email.value, password.value) != -1) {
        var user = new User('Default', 'Default', email.value, password.value);
        console.log(isExist(user));
        localStorage.setItem('currentUser', JSON.stringify(login(email.value, password.value)));
        user = localStorage.users[Number(JSON.parse(localStorage.getItem('currentUser')))].firstname + ' ' + localStorage.users[Number(JSON.parse(localStorage.getItem('currentUser')))].secondname;
        $('#user').text(user);
        window.location.href = 'index.html';
    } else {
        document.getElementById("error").textContent = "Wrong login or password";
    }
}

function register() {
    var name = document.getElementById('sign-name');
    var surname = document.getElementById('sign-surname');
    var email = document.getElementById('sign-email');
    var password = document.getElementById('sign-password');

    if (name.value == '' || surname.value == '' || email.value == '' || password.value == '') {
        document.getElementById("error").textContent = "Please enter correct data";
        return;
    }

    var new_user = new User(users.length + 1, name.value, surname.value, email.value, password.value);
    users.push(new_user);

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(users.length - 1));
    window.location.href = 'index.html';
}

function projectInfo(name, type, mainText) {
    $('#title').text(name);
    $('#type').text(type);
    $('#main-text').text(mainText);

    console.log(name);

    window.location.href = 'project.html';
}

function deleteProject() {
    projects.splice(currentProject, 1);

    localStorage.setItem('projects', JSON.stringify(projects));
    window.location.href = 'works.html';
}

function editProject() {
    document.getElementById('form-edit').style.display = 'flex';
    document.getElementById('form-edit').style.zIndex = 10;
}

function saveProject() {
    if (currentProject != -1 && currentProject != undefined) {
        projects[currentProject].mainText = document.getElementById('project-main-text').value;
        localStorage.setItem('projects', JSON.stringify(projects));
    }
    window.location.href = 'project.html';
}

function logOut() {
    currentUser = -1;
    localStorage.setItem('currentUser', currentUser);
}

function visibleMenu() {
    if (document.getElementById('select').style.display == 'flex')
        document.getElementById('select').style.display = 'none';
    else
        document.getElementById('select').style.display = 'flex';
}

function check() {
    console.log(projects[currentProject].user);
    if (projects[currentProject].user == currentUser) {
        document.getElementById("crud").style.display = 'flex';
    } else {
        document.getElementById("crud").style.display = 'none';
    }
}

function addComment() {
    var textComment = document.getElementById('comment-text').value;

    if (textComment != '') {
        projects[currentProject].comments.push([users[currentUser].getFullname(), textComment]);
        localStorage.setItem('projects', JSON.stringify(projects));
        window.location.href = 'project.html';
    }
}

function convertToText(number) {
    if (Math.abs(number) < 1000) return number;
    if (Math.abs(number) >= 1000 && Math.abs(number) < 1000000) return (number / 1000).toFixed(1) + 'k';
    if (Math.abs(number) >= 1000000 && Math.abs(number) < 1000000000) return (number / 1000000).toFixed(1) + 'M';
    else return (number / 1000000000).toFixed(1) + 'B';
}

function changePrivate() {
    if (document.getElementById('isPrivate').checked == true) {
        document.getElementById('lisPrivate').className = 'button-left';
        projects[currentProject].isPrivate = true;
        localStorage.setItem('projects', JSON.stringify(projects));
        data();
    } else {
        document.getElementById('lisPrivate').className = 'button';
        projects[currentProject].isPrivate = false;
        localStorage.setItem('projects', JSON.stringify(projects));
        data();
    }
}

function addUsers() {
    var selects = document.querySelectorAll('#chooseUser');
    var temp = [];
    temp.push(document.getElementById('choosenUser').value);
    selects.forEach((select) => {
        temp.push(select.value);
    });

    for (let i = 0; i < temp.length; i++) {
        for (let j = 0; j < temp.length; j++) {
            if (temp[i] == temp[j] && temp[j] != 'none' && i != j) {
                temp[j] = 'none';
            }
        }
    }

    for (let i = 0; i < temp.length; i++) {
        if (temp[i] == 'none') {
            temp.splice(i, 1);
            i--;
        }
    }

    if (existProject(currentProject) != -1) {
        teams[existProject(currentProject)].users = temp;
    } else
        teams.push(new Team(currentProject, temp));
    localStorage.setItem('teams', JSON.stringify(teams));
    window.location.href = 'project.html';
}

function existProject(id) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].projectId == id) return i;
    }
    return -1;
}

function addSelect() {
    var select = document.createElement('select');
    select.className = 'select-user';
    select.style.margin = '0 20px 0 0';
    select.id = 'chooseUser';
    for (let i = 0; i < users.length; i++) {
        var option = document.createElement('option');
        option.textContent = users[i].getFullname();
        option.value = i;
        select.prepend(option);
    }
    document.getElementById('choosen').prepend(select);
}

function addPanelUser() {
    document.getElementById('user-add-form').style.display = 'flex';
    document.getElementById('user-add-form').style.zIndex = 10;
    for (let i = 0; i < users.length; i++) {
        var option = document.createElement('option');
        option.textContent = users[i].getFullname();
        option.value = i;
        document.getElementById('choosenUser').prepend(option);
    }
}

function existAccess(idUser, idProject) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].projectId == idProject) {
            for (let j = 0; j < teams[i].users.length; j++) {
                if (Number(teams[i].users[j]) == idUser) return true;
            }
        }
    }
    return false;
}

function data() {
    if (localStorage.getItem("users") == null) localStorage.setItem('users', JSON.stringify([]));
    if (localStorage.getItem("projects") == null) localStorage.setItem('projects', JSON.stringify([]));
    if (localStorage.getItem("currentUser") == null) localStorage.setItem('currentUser', JSON.stringify(-1));
    if (localStorage.getItem("currentProject") == null) localStorage.setItem('currentProject', JSON.stringify(-1));
    if (localStorage.getItem("teams") == null) localStorage.setItem('teams', JSON.stringify([]));
    if (typeof(Storage) !== 'undefined') {
        var arr = JSON.parse(localStorage.getItem('users'));
        var arrProjects = JSON.parse(localStorage.getItem('projects'));

        users = [];
        for (let i = 0; i < arr.length; i++) {
            users.push(new User(arr[i].id, arr[i].firstname, arr[i].secondname, arr[i].email, arr[i].password));
        }

        projects = [];
        for (let i = 0; i < arrProjects.length; i++) {
            projects.push(new Project(arrProjects[i].id, arrProjects[i].name, arrProjects[i].type, arrProjects[i].src,
                arrProjects[i].user, arrProjects[i].comments, Boolean(arrProjects[i].isPrivate), arrProjects[i].likes, arrProjects[i].dislikes));
            projects[i].mainText = arrProjects[i].mainText;
        }

        var arrTeams = JSON.parse(localStorage.getItem('teams'));

        teams = [];
        for (let i = 0; i < arrTeams.length; i++) {
            teams.push(new Team(arrTeams[i].projectId, arrTeams[i].users));
        }

        currentProject = Number(localStorage.currentProject);

        currentUser = Number(localStorage.currentUser);

        if (projects.length != 0) {
            $("#comments").empty();
            for (let i = 0; i < projects[currentProject].comments.length; i++) {
                var cdiv = document.createElement('div');
                var ca = document.createElement('a');
                var ci = document.createElement('i');
                var cadiv = document.createElement('div');
                var ccdiv = document.createElement('div');

                cdiv.className = 'comment';
                ca.className = 'authorize';
                ci.classList.add('fas');
                ci.classList.add('fa-user-circle');
                cadiv.className = 'log-in';
                cadiv.textContent = projects[currentProject].comments[i][0];
                ccdiv.className = 'prj-text';
                ccdiv.style.marginTop = '15px';
                ccdiv.textContent = projects[currentProject].comments[i][1];

                ca.appendChild(ci);
                ca.appendChild(cadiv);
                cdiv.appendChild(ca);
                cdiv.appendChild(ccdiv);
                $("#comments").prepend(cdiv);
            }
        }



        $('#other-projects').empty();
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].user == currentUser) continue;
            if (projects[i].isPrivate == true)
                if (existAccess(currentUser, i) == false) continue;
            var pdiv = document.createElement('div');
            var pa = document.createElement('a');
            var pi = document.createElement('i');
            var padiv = document.createElement('div');
            var prjtdiv = document.createElement('div');
            var prjdiv = document.createElement('div');
            var prjbtn = document.createElement('input');
            var rate = document.createElement('div');
            var like = document.createElement('a');
            var ratetext = document.createElement('div');
            var dislike = document.createElement('a');

            rate.className = 'rate';
            like.className = 'fas fa-chevron-up rate-icon';
            dislike.className = 'fas fa-chevron-down rate-icon';
            ratetext.className = 'rate-text';
            ratetext.textContent = convertToText(projects[i].likes.length - projects[i].dislikes.length);
            like.onclick = function() {
                var access = true,
                    idDelete = -1;
                for (let j = 0; j < projects[i].likes.length; j++) {
                    if (projects[i].likes[j] == currentUser) {
                        access = false;
                        idDelete = j;
                    }
                }
                if (access) {
                    projects[i].likes.push(currentUser);
                    localStorage.setItem('projects', JSON.stringify(projects));
                    data();
                } else {
                    projects[i].likes.splice(idDelete, 1);
                    localStorage.setItem('projects', JSON.stringify(projects));
                    data();
                }
            }
            dislike.onclick = function() {
                var daccess = true,
                    didDelete = -1;
                for (let k = 0; k < projects[i].dislikes.length; k++) {
                    if (projects[i].dislikes[k] == currentUser) {
                        daccess = false;
                        didDelete = k;
                    }
                }
                if (daccess) {
                    projects[i].dislikes.push(currentUser);
                    localStorage.setItem('projects', JSON.stringify(projects));
                    data();
                } else {
                    projects[i].dislikes.splice(didDelete, 1);
                    localStorage.setItem('projects', JSON.stringify(projects));
                    data();
                }
            }
            rate.appendChild(like);
            rate.appendChild(ratetext);
            rate.appendChild(dislike);

            pdiv.className = 'container-col';
            pdiv.style.alignItems = 'flex-start';
            pdiv.style.width = '92%';
            pdiv.style.marginTop = '30px';

            pa.className = 'authorize';
            pi.classList.add('fas');
            pi.classList.add('fa-user-circle');
            padiv.className = 'log-in';
            prjtdiv.className = 'special-title';
            prjdiv.className = 'prj-text';
            prjbtn.type = 'button';
            prjbtn.value = 'More';
            prjbtn.style.marginTop = '10px';

            padiv.textContent = users[projects[i].user].getFullname();
            prjtdiv.textContent = projects[i].name;
            prjdiv.textContent = projects[i].type;
            prjbtn.onclick = function() {
                localStorage.setItem('currentProject', JSON.stringify(i));
                window.location.href = 'project.html';
            }
            prjbtn.className = 'button';
            pdiv.style.border = '1px solid white';
            pdiv.style.padding = '30px';

            pa.appendChild(pi);
            pa.appendChild(padiv);

            pdiv.appendChild(pa);
            pdiv.appendChild(prjtdiv);
            pdiv.appendChild(prjdiv);
            pdiv.appendChild(prjbtn);
            pdiv.appendChild(rate);
            console.log(i);
            $('#other-projects').append(pdiv);
        }
        if (currentUser != -1) {
            $('#user').text(users[currentUser].getFullname() + '   ▼');

            $('#projects').empty();
            for (let i = 0; i < projects.length; i++) {
                if (currentUser == projects[i].user || existAccess(currentUser, i)) {
                    var div = document.createElement('div');
                    var h = document.createElement('h1');
                    var p = document.createElement('p');
                    var img = document.createElement('img');
                    var btn = document.createElement('input');

                    div.className = 'project';
                    h.className = 'project-title';
                    p.className = 'project-text';
                    btn.className = 'more-btn';
                    btn.type = 'button';

                    h.innerHTML = projects[i].name;
                    p.innerHTML = projects[i].type;
                    img.src = projects[i].src;
                    btn.value = 'More';

                    btn.onclick = function() {
                        localStorage.setItem('currentProject', JSON.stringify(i));
                        window.location.href = 'project.html';
                    }

                    div.appendChild(h);
                    div.appendChild(p);
                    div.appendChild(btn);
                    div.appendChild(img);
                    $('#projects').prepend(div);
                }
            }
            if (projects.length != 0) {
                $('#title').text(projects[currentProject].name);
                $('#text').text(projects[currentProject].type);
                $('#like').html(convertToText(projects[currentProject].likes.length) + '<i class="fas fa-chevron-up other-text" style="margin-left: 10px;"></i>');
                $('#dislike').html(convertToText(projects[currentProject].dislikes.length) + '<i class="fas fa-chevron-down other-text" style="margin-left: 10px;"></i>');
                $('#main-text').text(projects[currentProject].mainText);
                if (currentUser == projects[currentProject].user || existAccess(currentUser, currentProject)) {
                    $("#crud").css('display', 'flex');
                    if (currentUser == projects[currentProject].user) {
                        $('#add-user').css('display', 'flex');
                    }
                    if (projects[currentProject].isPrivate == true) {
                        $('#lisPrivate').addClass('button-left');
                        $('#lisPrivate').removeClass('button');
                        $('#lisPrivate').text('Private off');
                    } else {
                        $('#lisPrivate').removeClass('button-left');
                        $('#lisPrivate').addClass('button');
                        $('#lisPrivate').text('Private on');
                    }
                    $("#c-t").css('display', 'none');
                    $("#c-f").css('display', 'none');
                }
            }
        }
    }
}