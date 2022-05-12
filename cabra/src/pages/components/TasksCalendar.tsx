import "@fullcalendar/react/dist/vdom";

import FullCalendar, { EventContentArg, EventInput } from "@fullcalendar/react";
import { ITask, TaskStatus } from "../../types/task";
import tw, { styled } from "twin.macro";

import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/outline";
import { add } from "date-fns";
import dayGridPlugin from "@fullcalendar/daygrid";
import { routeHelpers } from "../../routes";
import { useMemo } from "react";

interface Props {
  tasks: ITask[] | null;
  isLoading: boolean;
}

const Container = styled.div(tw`p-4 rounded-lg text-stone-50 bg-primary`);
const CalendarWrapper = styled.div`
  .fc-toolbar-chunk {
    ${tw`flex items-center gap-x-4`}
  }

  .fc-toolbar-title {
    ${tw`!m-0 text-xl font-bold`}
  }

  .fc-next-button,
  .fc-prev-button,
  .fc-today-button {
    ${tw`!m-0 px-2 !bg-secondary !shadow-lg !outline-none !border-none cursor-pointer`}
    ${tw`transform transition-transform hover:scale-105 disabled:(scale-100 cursor-default)`}
  }

  .fc-today-button {
    ${tw`capitalize font-bold`}
  }

  .fc-day {
    ${tw`text-sm text-left font-normal`}
  }
  .fc-theme-standard {
    td,
    th,
    .fc-scrollgrid {
      ${tw`border-none`}
    }
  }

  .fc-scrollgrid-sync-table {
    ${tw`border-separate`}

    tbody {
      ${tw`space-y-1`}
    }

    tr {
      ${tw`space-x-1`}
    }
  }

  .fc-daygrid-day {
    ${tw`p-0.5 relative`}

    .add-task-link {
      ${tw`hidden`}
    }

    &:hover {
      .add-task-link {
        ${tw`grid`}
      }
    }

    .fc-daygrid-day-frame {
      ${tw`rounded bg-secondary`}
    }

    .fc-daygrid-day-top {
      ${tw`flex-row`}
    }

    &.fc-day-other {
      .fc-daygrid-day-frame {
        ${tw`bg-tertiary`}
      }

      .fc-daygrid-day-top {
        ${tw`opacity-100 text-black`}
      }
    }

    &.fc-day-today {
      ${tw`bg-lightBlue-500 rounded`}
    }
  }

  .fc-daygrid-day-number {
    ${tw`flex w-full`}
  }

  .fc-more-popover {
    ${tw`rounded-lg`}

    .fc-popover-header {
      ${tw`text-primary bg-transparent`}
    }
  }
`;

function EventContent({ event }: EventContentArg) {
  const task: ITask = event.extendedProps.task;
  return (
    <Link
      to={routeHelpers.task.details(task.id)}
      css={[
        tw`bg-primary w-full text-stone-50 px-1 mx-0.5 rounded block truncate relative`,
        task.status !== TaskStatus.TODO && tw`opacity-75`,
      ]}
    >
      {event.title}
      {task.status !== TaskStatus.TODO && (
        <div tw="absolute -left-1 -right-1 h-0.5 bg-white pointer-events-none top-1/2 -translate-y-1/2" />
      )}
    </Link>
  );
}

function DayCellContent({ date, isOther }: { date: Date; isOther: boolean }) {
  const now = new Date();
  const linkDate = add(date, {
    hours: now.getHours(),
    minutes: now.getMinutes(),
  });

  return (
    <div tw="flex justify-between w-full px-1 pt-1">
      <div>{date.getDate()}</div>
      <Link
        to={routeHelpers.task.new(linkDate)}
        css={[
          tw`grid place-items-center w-4 h-4 rounded shadow-2xl`,
          isOther
            ? tw`bg-secondary text-stone-50`
            : tw`bg-tertiary text-primary`,
        ]}
        className="add-task-link"
      >
        <PlusIcon height={12} width={12} />
      </Link>
    </div>
  );
}

function TasksCalendar({ isLoading, tasks }: Props) {
  const calendarEvents: EventInput[] = useMemo(
    () =>
      tasks
        ?.filter(({ dueDate }) => !!dueDate)
        .map((task) => ({
          id: task.id,
          start: new Date(task.dueDate as string),
          end: new Date(task.dueDate as string),
          title: task.title,
          task,
        })) ?? [],
    [tasks]
  );

  if (isLoading) return <Container>Loading tasks</Container>;
  if (!tasks) return <Container>Oops! Error loading tasks.</Container>;

  return (
    <Container tw="w-full">
      <CalendarWrapper>
        <FullCalendar
          height="90vh"
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale="en-GB"
          firstDay={1}
          dayHeaderFormat={{ weekday: "long" }}
          headerToolbar={{
            left: "prev title next",
            center: "",
            right: "today",
          }}
          events={calendarEvents}
          eventContent={EventContent}
          dayMaxEvents={true}
          dayCellContent={DayCellContent}
        />
      </CalendarWrapper>
    </Container>
  );
}

export default TasksCalendar;
