
var config = {
    apiKey: "AIzaSyAj-lwrn0ZPrgtCnHk_IzFaEOyIwHtROC8",
    authDomain: "trainscheduele.firebaseapp.com",
    databaseURL: "https://trainscheduele.firebaseio.com",
    projectId: "trainscheduele",
    storageBucket: "trainscheduele.appspot.com",
    messagingSenderId: "1027812887412"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();
    var trainInput = $("#train-name-input").val().trim();
    var destinationInput = $("#destination-input").val().trim();
    var startInput = moment($("#start-input").val().trim(), "HH:mm").format("X");
    var frequencyInput = $("#frequency-input").val().trim();
    var trainData = {
        trainInput: trainInput,
        destinationInput: destinationInput,
        startInput: startInput,
        frequencyInput: frequencyInput
    };
    database.ref().push(trainData);
    console.log(trainData);
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
});

database.ref().on("child_added", function(childSnapshot) {
    var trainInput = childSnapshot.val().trainInput;
    var destinationInput = childSnapshot.val().destinationInput;
    var startInput = childSnapshot.val().startInput;
    var frequencyInput = childSnapshot.val().frequencyInput;

        // First Time (pushed back 1 year to make sure it comes before current time)
    //     var startInputConverted = moment(startInput, "HH:mm").subtract(1, "years");
    
        var startInputConverted = moment.unix(startInput).format("HH:mm");
        
        // Current Time
        var currentTime = moment();
        
        // Difference between the times
        var diffTime = moment().diff(moment(startInput, "X"), "minutes");
        console.log("diffTime", diffTime);
    
        // var empStartPretty = moment.unix(empStart).format("MM/DD/YYYY");

        // // Calculate the months worked using hardcore math
        // // To calculate the months worked
        // var empMonths = moment().diff(moment(empStart, "X"), "months");



        // Time apart (remainder)
        var tRemainder = diffTime % frequencyInput;
        console.log("diffTime", diffTime);
       
        // Minute Until Train
        var tMinutesTillTrain = frequencyInput - tRemainder;
        
        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        var newRow = $("<tr>").append(
            $("<td>").text(trainInput),
            $("<td>").text(destinationInput),
            $("<td>").text(frequencyInput),
            $("<td>").text(nextTrain),
            $("<td>").text(tMinutesTillTrain),
            );

        $("#train-table > tbody").append(newRow);
});