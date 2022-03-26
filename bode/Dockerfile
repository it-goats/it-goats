FROM python:3.10.4

WORKDIR /bode

COPY pyproject.toml poetry.lock /bode/

RUN pip3 install poetry==1.1.13
RUN poetry config virtualenvs.create false
RUN poetry install

COPY . /bode

CMD poetry run flask run --host=$FLASK_HOST --port=$FLASK_PORT