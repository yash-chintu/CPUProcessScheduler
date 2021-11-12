const time_Quantum = document.querySelector('#Time_quantum');
const priorities = document.querySelector('#Priorities');
const solve = document.querySelector('#solve');




function clearform() {
    const AT = document.querySelector('#AT');
    const BT = document.querySelector('#BT');
    AT.value = '';
    BT.value = '';
}


algo_type.addEventListener('change', () => {
    const algo_type = document.querySelector('#algo_type');

    if (algo_type.value === 'PS') {
        time_Quantum.innerHTML = '';
        priorities.innerHTML = '<label for="PT" class="label">Priorities</label><input class="input" type="text" id="PT" placeholder="Lower => high priority">';
        const PT = document.querySelector('#PT');
        PT.value = '';
    } else if (algo_type.value === 'RR') {
        priorities.innerHTML = '';
        time_Quantum.innerHTML = '<label for="TQ" class="label">Time Quantum</label><input class="input" type="text" id="TQ" placeholder="eg. 3">';
        const TQ = document.querySelector('#TQ');
        TQ.value = '';
    } else {
        priorities.innerHTML = '';
        time_Quantum.innerHTML = '';
    }

    clearform();

    cleartable();
})

function cleartable() {
    var table = document.querySelector('#output_table');
    table.innerHTML = '';
    var table2 = document.querySelector('#gant_table');
    table2.innerHTML = '';
}






function validateform() {
    const algo_type = document.querySelector('#algo_type');
    const AT = document.querySelector('#AT');
    const BT = document.querySelector('#BT');
    const TQ = document.querySelector('#TQ');
    const PT = document.querySelector('#PT');

    if (algo_type.value === 'RR') {
        if (AT.value === '' || BT.value === '' || TQ.value === '') {
            alert('Some fields are missing');
            return false;
        }

    } else if (algo_type.value === 'PS') {
        if (AT.value === '' || BT.value === '' || PT.value === '') {
            alert('Some fields are missing');
            return false;
        }
    } else {
        if (AT.value === '' || BT.value === '') {
            alert('Some fields are missing');
            return false;
        }
    }
    return true;
}

function check(arr) {
    //console.log(arr);
    for (i = 0; i < arr.length; i++) {
        if (arr[i] === NaN || isNaN(arr[i])) {
            return false;
        }
    }
    return true;
}

solve.addEventListener('click', () => {

    if (validateform()) {
        const algo_type = document.querySelector('#algo_type');
        const AT = document.querySelector('#AT');
        const BT = document.querySelector('#BT');
        const TQ = document.querySelector('#TQ');
        const PT = document.querySelector('#PT');

        var at = AT.value.split(' ').map(Number);
        var bt = BT.value.split(' ').map(Number);
        if (algo_type.value === "RR")
            var tq = TQ.value.split(' ').map(Number);
        if (algo_type.value === "PS")
            var pt = PT.value.split(' ').map(Number);


        var valid = false;

        if (check(at) && check(bt)) {
            if (algo_type.value === "RR") {
                if (check(tq)) {
                    valid = true;
                }
            } else if (algo_type.value === "PS") {
                if (check(pt)) {
                    valid = true;
                }
            } else {
                valid = true;
            }
        }

        if (!valid) {

            alert("Invalid Inputs");
        } else {

            esize = false;

            if (at.length === bt.length) {
                if (algo_type.value === "PS") {
                    if (pt.length === at.length) {
                        esize = true;
                    }
                } else {
                    esize = true;
                }
            }
            if (!esize) {
                alert("Input Size mismatch");
            }
            if (algo_type.value === "RR" && esize) {
                if (tq.length !== 1) {
                    alert("Invalid time quantum");
                    esize = false;
                }

            }
            if (esize) {
                cleartable();
                generateoutputs();
            }
        }
    }

})



function generateoutputs() {
    const algo_type = document.querySelector('#algo_type');
    const AT = document.querySelector('#AT');
    const BT = document.querySelector('#BT');
    const TQ = document.querySelector('#TQ');
    const PT = document.querySelector('#PT');

    var at = AT.value.split(' ').map(Number);
    var bt = BT.value.split(' ').map(Number);
    if (algo_type.value === "RR")
        var tq = TQ.value.split(' ').map(Number);
    if (algo_type.value === "PS")
        var pt = PT.value.split(' ').map(Number);

    if (algo_type.value === "FCFS") {
        fcfs(at, bt);
    } else if (algo_type.value === "SJF") {
        sjf(at, bt);
    } else if (algo_type.value === "LJF") {
        ljf(at, bt);
    } else if (algo_type.value === "PS") {
        ps(at, bt, pt);
    } else if (algo_type.value === "RR") {
        rr(at, bt, tq);
    }
}




class QElement {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}

// PriorityQueue class
class PriorityQueue {


    constructor() {
        this.items = [];
    }


    enqueue(element, priority) {

        var qElement = new QElement(element, priority);
        var contain = false;

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {

                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }


        if (!contain) {
            this.items.push(qElement);
        }
    }


    dequeue() {

        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }


    front() {

        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }






    isEmpty() {
        // return true if the queue is empty.
        return this.items.length == 0;
    }


}





function fcfs(at, bt) {
    var gant = [];
    var current_time = 0;
    var li = []; // key = ID , val = Arrival time -> 0 , burst  ->1  , Finish time ->2 , Tat -> 3, waiting time -> 4
    for (var i = 0; i < at.length; i++) {
        li.push({
            key: (i + 1),
            val: [at[i], bt[i]]
        })
    }
    li.sort(function (a, b) {
        return a.val[0] - b.val[0];
    });
    for (var i = 0; i < at.length; i++) {
        if (current_time < li[i].val[0]) {
            current_time = li[i].val[0];
            gant.push([-1, current_time]);
        }
        current_time += li[i].val[1];
        gant.push([li[i].key, current_time]);

        li[i].val.push(current_time); //finish time
        li[i].val.push(current_time - li[i].val[0]); //Tat
        li[i].val.push(li[i].val[3] - li[i].val[1]);


    }
    //console.log(gant);
    creategant(gant);
    createtable();
    insertintotable(li);
}




function sjf(at, bt) {
    var pq = new PriorityQueue(); // priority = BT , Element = AT -> 0 , BT -> 1 , PID -> 2



    var gant = [];
    var current_time = 0;

    var li = []; // key = ID , val = Arrival time -> 0 , burst  ->1  
    var ans = []; // key = ID , val = Arrival time -> 0 , burst  ->1  , Finish time ->2 , Tat -> 3, waiting time -> 4
    for (var i = 0; i < at.length; i++) {
        li.push({
            key: (i + 1),
            val: [at[i], bt[i]]
        })
    }

    li.sort(function (a, b) {
        return a.val[0] - b.val[0];
    });

    //console.log(li);

    for (var i = 0; i < at.length; i++) {
        if (pq.isEmpty()) {
            if (current_time < li[i].val[0]) {
                current_time = li[i].val[0];
                gant.push([-1, current_time]);
            }
        }
        while (!(pq.isEmpty()) && current_time < li[i].val[0]) {
            var p = pq.front().element;
            //console.log(p);
            if (current_time < p[0]) {
                current_time = p[0];
                gant.push([-1, current_time]);
            }
            current_time += p[1];
            gant.push([p[2], current_time]);
            ans.push({
                key: p[2],
                val: [p[0], p[1], current_time, current_time - p[0], current_time - p[0] - p[1]]
            });


            pq.dequeue();
        }

        pq.enqueue([li[i].val[0], li[i].val[1], li[i].key], bt[i]);
        //console.log(at[i]);
    }

    while (!pq.isEmpty()) {
        var p = pq.front().element;
        if (current_time < p[0]) {
            current_time = p[0];
            gant.push(-1, current_time);
        }
        current_time += p[1];
        gant.push([p[2], current_time]);
        ans.push({
            key: p[2],
            val: [p[0], p[1], current_time, current_time - p[0], current_time - p[0] - p[1]]
        })


        pq.dequeue();
    }

    creategant(gant);
    createtable();
    insertintotable(ans);
}






function ljf(at, bt) {
    var pq = new PriorityQueue(); // priority = BT , Element = AT -> 0 , BT -> 1 , PID -> 23



    var gant = [];
    var current_time = 0;

    var li = []; // key = ID , val = Arrival time -> 0 , burst  ->1  
    var ans = []; // key = ID , val = Arrival time -> 0 , burst  ->1  , Finish time ->2 , Tat -> 3, waiting time -> 4
    for (var i = 0; i < at.length; i++) {
        li.push({
            key: (i + 1),
            val: [at[i], bt[i]]
        })
    }

    li.sort(function (a, b) {
        return a.val[0] - b.val[0];
    });

    //console.log(li);

    for (var i = 0; i < at.length; i++) {
        if (pq.isEmpty()) {
            if (current_time < li[i].val[0]) {
                current_time = li[i].val[0];
                gant.push([-1, current_time]);
            }
        }
        while (!(pq.isEmpty()) && current_time < li[i].val[0]) {
            var p = pq.front().element;
            //console.log(p);
            if (current_time < p[0]) {
                current_time = p[0];
                gant.push([-1, current_time]);
            }
            current_time += p[1];
            gant.push([p[2], current_time]);
            ans.push({
                key: p[2],
                val: [p[0], p[1], current_time, current_time - p[0], current_time - p[0] - p[1]]
            });


            pq.dequeue();
        }

        pq.enqueue([li[i].val[0], li[i].val[1], li[i].key], -bt[i]);
        //console.log(at[i]);
    }

    while (!pq.isEmpty()) {
        var p = pq.front().element;
        if (current_time < p[0]) {
            current_time = p[0];
            gant.push(-1, current_time);
        }
        current_time += p[1];
        gant.push([p[2], current_time]);
        ans.push({
            key: p[2],
            val: [p[0], p[1], current_time, current_time - p[0], current_time - p[0] - p[1]]
        })


        pq.dequeue();
    }

    creategant(gant);
    createtable();
    insertintotable(ans);
}






function ps(at, bt, pt) {
    var pq = new PriorityQueue(); // priority = BT , Element = AT -> 0 , BT -> 1 , PID -> 23



    var gant = [];
    var current_time = 0;

    var li = []; // key = ID , val = Arrival time -> 0 , burst  ->1  , pt-> 2
    var ans = []; // key = ID , val = Arrival time -> 0 , burst  ->1  , Finish time ->2 , Tat -> 3, waiting time -> 4
    for (var i = 0; i < at.length; i++) {
        li.push({
            key: (i + 1),
            val: [at[i], bt[i], pt[i]]
        })
    }

    li.sort(function (a, b) {
        return a.val[0] - b.val[0];
    });

    //console.log(li);

    for (var i = 0; i < at.length; i++) {
        if (pq.isEmpty()) {
            if (current_time < li[i].val[0]) {
                current_time = li[i].val[0];
                gant.push([-1, current_time]);
            }
        }
        while (!(pq.isEmpty()) && current_time < li[i].val[0]) {
            var p = pq.front().element;
            //console.log(p);
            if (current_time < p[0]) {
                current_time = p[0];
                gant.push([-1, current_time]);
            }
            current_time += p[1];
            gant.push([p[2], current_time]);
            ans.push({
                key: p[2],
                val: [p[0], p[1], current_time, current_time - p[0], current_time - p[0] - p[1]]
            });


            pq.dequeue();
        }

        pq.enqueue([li[i].val[0], li[i].val[1], li[i].key], li[i].val[2]);
        //console.log(at[i]);
    }

    while (!pq.isEmpty()) {
        var p = pq.front().element;
        if (current_time < p[0]) {
            current_time = p[0];
            gant.push(-1, current_time);
        }
        current_time += p[1];
        gant.push([p[2], current_time]);
        ans.push({
            key: p[2],
            val: [p[0], p[1], current_time, current_time - p[0], current_time - p[0] - p[1]]
        })


        pq.dequeue();
    }

    creategant(gant);
    createtable();
    insertintotable(ans);
}

function rr(at, bt, tq) {
    tq = parseInt(tq);
    var gant = [];
    var li = []; //key = ID , val = Arrival time -> 0 , burst  ->1  ,rem_burst ->2,ft-3
    var ans = []; // key = ID , val = Arrival time -> 0 , burst  ->1  , Finish time ->2 , Tat -> 3, waiting time -> 4
    var current_time = 0;
    for (var i = 0; i < at.length; i++) {
        li.push({
            key: (i + 1),
            val: [at[i], bt[i], bt[i]]
        })
    }

    li.sort(function (a, b) {
        return a.val[0] - b.val[0];
    });
    var finish_count = 0;

    while (1) {
        var none = true;
        if (finish_count < at.length) {
            var i;
            for (i = 0; i < at.length; i++) {
                if (li[i].val[0] <= current_time && li[i].val[2] > 0) {
                    none = false;
                    if (li[i].val[2] > tq) {
                        li[i].val[2] -= tq;
                        current_time += tq;
                        gant.push([li[i].key, current_time]);
                    } else if (li[i].val[2] === tq) {
                        li[i].val[2] = 0;
                        current_time += tq;
                        finish_count++;
                        gant.push([li[i].key, current_time]);
                        li[i].val.push(current_time);
                    } else {
                        current_time += li[i].val[2];
                        li[i].val[2] = 0;
                        finish_count++;
                        gant.push([li[i].key, current_time]);
                        li[i].val.push(current_time);
                    }
                } else {
                    if (li[i].val[0] > current_time) {
                        break;
                    }
                }

            }
            if (none) {
                current_time = li[i].val[0];
                gant.push([-1, current_time]);
            }
        } else {
            break;
        }
    }
    console.log(li);

    for (var i = 0; i < li.length; i++) {
        ans.push({
            key: (i + 1),
            val: [li[i].val[0], li[i].val[1], li[i].val[3], li[i].val[3] - li[i].val[0], li[i].val[3] - li[i].val[0] - li[i].val[1]]
        })

    }

    creategant(gant);
    createtable();
    insertintotable(ans);
}


function creategant(gant) {
    var gant_table = document.querySelector('#gant_table');
    var tr = document.createElement('TR');
    var tr2 = document.createElement('TR');
    var th = document.createElement('TH');
    var th2 = document.createElement('TH');

    th.innerHTML = "Time";
    th2.innerHTML = "PID";

    tr.appendChild(th);
    tr2.appendChild(th2);

    var temp = 0;

    for (var i = 0; i < gant.length; i++) {
        var td = document.createElement('TD');
        var td2 = document.createElement('TD');
        td.innerHTML = `${temp} -> ${gant[i][1]}`
        temp = gant[i][1];
        tr.appendChild(td);
        td2.innerHTML = `${gant[i][0]}`
        if (gant[i][0] === -1) {
            td2.innerHTML = "";
            td2.className = `has-background-danger-light`;
        } else {
            td2.className = `has-background-success-light`;
        }
        tr2.appendChild(td2);
    }

    gant_table.appendChild(tr);
    gant_table.appendChild(tr2);
}


function createtable() {
    var table = document.querySelector('#output_table');
    table.innerHTML = `
    <thead >
        <tr >
        <th > PID </th>
        <th > Arrival Time </th>
        <th > Burst Time </th>
        <th > Finish Time </th>
        <th > Turnaround Time </th>
        <th > Waiting Time </th>
        </tr> </thead>
        </table>`
}

function insertintotable(li) {
    var table = document.querySelector('#output_table');
    var TAT_SUM = 0;
    var WT_SUM = 0;

    li.sort(function (a, b) {
        return a.key - b.key;
    })


    for (var i = 0; i < li.length; i++) {
        var tr = document.createElement('TR');
        var td = document.createElement('TD');
        td.innerHTML = li[i].key;
        tr.appendChild(td);
        for (var j = 0; j < 5; j++) {
            var td = document.createElement('TD');
            td.innerHTML = li[i].val[j];
            tr.appendChild(td);
        }
        table.appendChild(tr);

        TAT_SUM += li[i].val[3];
        WT_SUM += li[i].val[4];

    }

    var tf = document.createElement('tfoot');
    var tr = document.createElement('TR');
    var avg = document.createElement('TH');

    avg.innerHTML = "Average";
    avg.colSpan = 4;
    tr.appendChild(avg);

    var avg_tat = document.createElement('TH');
    var avg_wt = document.createElement('TH');

    avg_tat.innerHTML = TAT_SUM / li.length;
    avg_wt.innerHTML = WT_SUM / li.length;


    tr.appendChild(avg_tat);
    tr.appendChild(avg_wt);

    tf.appendChild(tr);
    table.appendChild(tf);
}