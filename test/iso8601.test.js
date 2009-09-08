$(document).ready(function(){
    runTest();
});

function runTest(){
    module("format");
    var sampleDate = new Date(Date.UTC(2009,9-1,6,16,12,24,123));
    // week,time,month,date,datetime,datetime-local
    test("date", function(){
	equals(isodate.format(sampleDate, "date"), "2009-09-06");
    });
    test("month", function() {
	equals(isodate.format(sampleDate, "month"), "2009-09");
    });
    test("datetime", function() {
	equals(isodate.format(sampleDate, "datetime"), "2009-09-06T16:12:24.123Z");
    });
    test("time", function(){
	equals(isodate.format(sampleDate, "time"), "16:12:24.123");
    });
    test("week", function(){
	equals(isodate.format(sampleDate, "week"), "2009-W36");
    });
    test("invalid param", function() {
	ok(isodate.format(null) === null);
    });

    module("parse");
    test("date", function(){
	equals(isodate.parse("2009-09-06", "date").getTime(), Date.UTC(2009,9-1,6));
    });
    test("month", function(){
	equals(isodate.parse("2009-09", "month").getTime(), Date.UTC(2009,9-1));
    });
    test("datetime", function(){
	equals(isodate.parse("2009-09-06T16:12:24.123Z", "datetime").getTime(), Date.UTC(2009,9-1,6,16,12,24,123));
    });
    test("time", function(){
	var expectedDate = new Date(0);
	expectedDate.setUTCHours(16);
	expectedDate.setUTCMinutes(12);
	expectedDate.setUTCSeconds(24);
	expectedDate.setUTCMilliseconds(123);
	equals(isodate.parse("16:12:24.123", "time").getTime(), expectedDate.getTime());
    });
    test("week", function(){
	equals(isodate.parse("2009-W36", "week").getTime(), Date.UTC(2009,8-1,31));
    });
    test("parse error", function() {
	ok(isodate.parse("200901", "date") === null);
    });
    test("invalid param", function() {
	ok(isodate.parse(null, "date") === null);
    });
}
