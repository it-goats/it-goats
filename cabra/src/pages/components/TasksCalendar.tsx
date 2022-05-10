import "@fullcalendar/react/dist/vdom";

import FullCalendar, { EventContentArg, EventInput } from "@fullcalendar/react";
import tw, { styled } from "twin.macro";

import { ITask } from "../../types/task";
import dayGridPlugin from "@fullcalendar/daygrid";
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
    ${tw`p-0.5`}

    .fc-daygrid-day-frame {
      ${tw`rounded bg-secondary`}
    }

    .fc-daygrid-day-top {
      ${tw`flex-row text-xs`}
    }

    &.fc-day-other {
      .fc-daygrid-day-frame {
        ${tw`bg-tertiary`}
      }

      .fc-daygrid-day-top {
        ${tw`opacity-100 `}
      }
    }

    &.fc-day-today {
      ${tw`bg-cyan-400 rounded`}
    }
  }
`;

function EventContent({ event }: EventContentArg) {
  return <div>{event.title}</div>;
}

function TasksCalendar({ isLoading, tasks }: Props) {
  const calendarEvents: EventInput[] = useMemo(
    () =>
      tasks?.map((task) => ({
        ...task,
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
        />
      </CalendarWrapper>
    </Container>
  );
}

export default TasksCalendar;
