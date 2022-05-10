import "@fullcalendar/react/dist/vdom";

import FullCalendar, { EventContentArg, EventInput } from "@fullcalendar/react";
import tw, { styled } from "twin.macro";

import { ITask } from "../../types/task";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/outline";
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
      ${tw`bg-cyan-400 rounded`}
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
  return (
    <Link
      to={routeHelpers.task.details(event.extendedProps.task.id)}
      tw="bg-primary w-full text-stone-50 px-1 mx-0.5 rounded block truncate"
    >
      {event.title}
    </Link>
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
          dayCellContent={({ date }) => (
            <div tw="flex justify-between w-full px-1 pt-1">
              <div>{date.getDate()}</div>
              <Link
                to={routeHelpers.task.new(date)}
                tw="grid place-items-center w-4 h-4 rounded bg-tertiary text-primary"
                className="add-task-link"
              >
                <PlusIcon height={12} width={12} />
              </Link>
            </div>
          )}
        />
      </CalendarWrapper>
    </Container>
  );
}

export default TasksCalendar;
