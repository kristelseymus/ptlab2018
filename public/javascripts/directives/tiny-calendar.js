'use strict';

angular.module('ptlab').directive('tinyCalendar', [ function() {

    function removeTime(date) {
        return date.startOf('day');
    }

    function firstSelected(month, date) {
        var s = null;
        for (var i = 0; i < month.length; i++) {
            if (date && month[i].date === date) {
                s = month[i];
                break;
            } else if (!date && month[i].isToday) {
                s = month[i];
                break;
            }
        }
        return s;
    }

    function buildMonth(start, events, firstDay) {
        if(!firstDay || isNaN(firstDay)){
            firstDay = 0;
        }
        var days = [];
        var date = removeTime(start.clone().date(0).day(firstDay));
        for (var i = 0; i < 42; i++) {
            days.push({
                number: date.date(),
                isCurrentMonth: date.month() === start.month(),
                isToday: date.isSame(moment().format(), 'day'),
                date: date.format(),
            });
            date = date.clone();
            date.add(1, 'd');
        }
        return addEvents(days, events);
    }


    function addEvents(month, events) {
        if(!events){
            return month;
        }
        return month.map(function(day) {
            var ev = [];
            var d = moment(day.date);
            events.forEach(function(event) {
                var s = removeTime(moment(event.startDate));
                var e = event.endDate ? removeTime(moment(event.endDate)) : s.clone();
                if (moment().range(s, e).contains(d)) {

                    ev.push(event);
                }
            });
            if (ev.length > 0) {
                day.events = ev;
            }
            return day;
        });
    }

    return {
        restrict: 'A',
        scope: {
            events: '='
        },

        // replace: true,
        template: function(element, attrs) {
            var defaultsAttrs = {
                weekDays : 'SMTWTFS',
                today: 'today',
                allDayLabel : 'All day',
                firstDay: 0
            };
            for (var xx in defaultsAttrs) {
                if (attrs[xx] === undefined) {
                    attrs[xx] = defaultsAttrs[xx];
                }
            }

            attrs.weekDays = attrs.weekDays.split('').slice(0,7);
            if(attrs.firstDay){
                attrs.weekDays = attrs.weekDays.slice(attrs.firstDay).concat(attrs.weekDays.slice(0, attrs.firstDay));
            }
            attrs.weekDays = '[' + attrs.weekDays.map(function(day){
                return '"'+day+'"';
            }).join(',').replace('"', '&quot;') + ']';

            var html =  "<div class='tc-container'>";
                html+=      "<div class='tc-header'>{{currentMonth.format('MMMM YYYY')}}";
                html+=          "<div class='tc-navigation'>";
                html+=              "<button ng-click='previous()'>«</button>";
                html+=              "<button ng-click='today()'>"+attrs.today+"</button>";
                html+=              "<button ng-click='next()'>»</button>";
                html+=          "</div>";
                html+=      "</div>";
                html+=      "<div class='tc-days-name'>";
                html+=          "<div class='tc-day-name' ng-repeat='wd in "+attrs.weekDays+" track by $index'>{{wd}}</div>";
                html+=      "</div>";
                html+=      "<div class='tc-days'>";
                html+=          "<div ng-repeat='day in month' class='tc-day' ng-class='{ today: day.isToday, differentMonth: !day.isCurrentMonth, selected: day.date === selected.date, hasEvents: day.events.length > 0}' ng-click='select(day)'>{{day.number}}</div>";
                html+=      "</div>";
                html+=      "<div class='tc-focus' ng-show='selected.events'>";
                html+=          "<ul>";
                html+=              "<li ng-repeat='e in selected.events | orderBy:&quot;date&quot;'><span class='tc-time' ng-show='e.time'>{{e.time}}</span><span class='tc-time' ng-hide='e.time'>"+attrs.allDayLabel+"</span><span class='tc-title' ng-bind-html='e.title'></span></li>";
                html+=          "</ul>";
                html+=      "</div>";
                html+=  "</div>";

            return html;
        },

        link: function(scope, el, attrs) {
                var today = moment().format();
                scope.currentMonth = moment();
                var start = scope.currentMonth.clone();

                scope.month = buildMonth((start), scope.events, attrs.firstDay);

                scope.selected = firstSelected(scope.month);
                scope.select = function(day) {
                    if (day.isCurrentMonth) {
                        scope.selected = day;
                    } else {
                        scope.currentMonth = moment(day.date);
                        scope.month = buildMonth(scope.currentMonth, scope.events, attrs.firstDay);
                        scope.selected = firstSelected(scope.month, day.date);
                    }


                };

                scope.today = function() {
                    scope.currentMonth = moment(today);
                    scope.month = buildMonth(scope.currentMonth, scope.events, attrs.firstDay);
                    scope.selected = firstSelected(scope.month, removeTime(scope.currentMonth).format());
                };

                scope.previous = function() {
                    scope.selected = null;
                    scope.currentMonth.subtract(1, 'months');
                    scope.month = buildMonth(scope.currentMonth, scope.events, attrs.firstDay);

                };

                scope.next = function() {
                    scope.selected = null;
                    scope.currentMonth.add(1, 'months');
                    scope.month = buildMonth(scope.currentMonth, scope.events, attrs.firstDay);
                };


            }

    };
}]);
