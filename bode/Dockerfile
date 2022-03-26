FROM python:3.10.4

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /bode

COPY . /bode
COPY pyproject.toml /bode
COPY poetry.lock /bode

RUN pip3 install poetry==1.1.13
RUN poetry config virtualenvs.create false
RUN poetry install

CMD poetry run flask run --host=$FLASK_HOST --port=$FLASK_PORT