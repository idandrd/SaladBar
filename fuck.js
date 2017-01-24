function add_buttons() {
    $(".td_dishContent").append('<div id="read_btn" class="dishContent_addDishBtn button straightButton" style="margin: 10px;"><span>שמור</span></button>');
    $(".td_dishContent").append('<div id="write_btn" class="dishContent_addDishBtn button straightButton"><span>סמן</span></button>');
}

function save_selection() {
    // alert('idan!');
    userid = get_user_id();
    sid = dishid+'@'+userid;
    data = {};
    data[sid] = {
        "checks":{},
        "radio": [],
        "drops": [],
        "comments": ""
        };
    checkboxes = $("#dishContent input[type='checkbox']");
    for (i = 0; i< checkboxes.length; i++) {
        id = checkboxes[i].id;
        if (id != "") {
            stat = $("#"+id).is(":checked");
            data[sid].checks[id] = stat;
        }
    }
    radio_btns = $("#dishContent input[type='radio']");
    for (i = 0; i< radio_btns.length; i++) {
        id = radio_btns[i].id;
        if ($("#"+id).is(":checked")) {
            data[sid].radio.push(id);
        }
    }
    dropdowns = $("#dishContent tbody option:selected");
    for (i = 0; i< dropdowns.length; i++) {
        id = dropdowns[i].value;
        data[sid].drops.push(id);
    }
    comments = $("#dishSpecialInstructions").val();
    data[sid].comments = comments;
    chrome.storage.sync.set(data, function() {
        console.log(data);
    });
}

function apply_selection() {
    userid = get_user_id();
    sid = dishid+'@'+userid;
    chrome.storage.sync.get(sid, function(obj) {
        data = obj[sid];
        for (var key in data.checks) {
            record_stat = data.checks[key];
            current_stat = $("#"+key).is(":checked");
            if (current_stat != record_stat) {
                $("#"+key).click();
            }
        }
        for (i = 0; i< data.radio.length; i++) {
            if (!$("#"+data.radio[i]).is(":checked")) {
                $("#"+data.radio[i]).click();
            }
        }
        for (i = 0; i< data.drops.length; i++) {
            id = data.drops[i];
            $("[value='"+id+"']").attr("selected", true);
        }
        $("#dishSpecialInstructions").val(data.comments);
    });
}

function get_user_id() {
    return $("[data-dish-assigned-users-select='true'] option:selected").text();
}



$(document).ready(function(){
    dishid = "";
    $(".dishesBox").click(function(){
        dishid = $(this).attr('data-dishid');
    });
    add_buttons();
    $("#read_btn").click(function() {
        save_selection();
    });
    $("#write_btn").click(function() {
        apply_selection();
    });
});