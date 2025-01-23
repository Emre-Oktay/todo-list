import { isToday, addDays, isWithinInterval } from 'date-fns';

import listImage from './assets/list.svg';
import dotsImage from './assets/three-dots.svg';
import circleImage from './assets/circle.svg';
import checkCircleImage from './assets/check-circle.svg';
import dateImage from './assets/calendar.svg';
import priorityImage from './assets/flag.svg';
import priorityCheckImage from './assets/flag-red.svg';
import threeDotsImage from './assets/three-dots.svg';

export const FilterTypes = {
    TODAY: (todo) => isToday(todo.dueDate),
    UPCOMING: (todo) => {
        const today = new Date();
        const sevenDaysFromNow = addDays(today, 7);
        return todo.dueDate && isWithinInterval(todo.dueDate, { start: today, end: sevenDaysFromNow });
    },
    IMPORTANT: (todo) => todo.isPriority,
    ACTIVE: (todo) => !todo.isComplete,
    COMPLETED: (todo) => todo.isComplete,
};

export const Icons = {
    LIST: listImage,
    DOTS: dotsImage,
    CIRCLE: circleImage,
    CHECK_CIRCLE: checkCircleImage,
    DATE: dateImage,
    PRIORITY: priorityImage,
    PRIORITY_CHECK: priorityCheckImage,
    THREE_DOTS: threeDotsImage,
};
