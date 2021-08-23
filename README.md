# EvacuationC

**EvacuationC** -- программа моделирования движения людей в здании. 

Резульататом работы программы является время освобождения здания (длительность эвакуации).

# Сборка

## Интсрументарий
- GNU/Linux \*ubuntu >= 18.04
- cmake >= 3.16
- gcc-10
- [json-c 0.13](https://github.com/json-c/json-c/releases/tag/json-c-0.13.1-20180305)

``` bash
sudo apt install cmake gcc-10 libjson-c-dev
```

Клонируйте репозиторий
``` bash
git clone git@github.com:bvchirkov/EvacuationC.git
```
Выполните настройку окружения и сборку проекта
``` bash
cd EvacuationC
mkdir build
cmake -S  . -B build/ && cmake --build build/
```
Готовый к запуску файл расположен в дирректории `build/` -- `EvacuationC`

# Запуск

Программе необходимо передать файл описания здания, выполненный в QGIS 2.18 с использованием плагина [PlanCreator](https://github.com/bvchirkov/PlanCreator)

``` bash
cd build
./EvacuationC path/to/file.json
```

## Результат работы программы

``` bash
cd build
./EvacuationC ../res/two_levels.json

Файл описания объекта: ../res/two_levels.json
Название объекта: Здание номер 1
Площадь здания: 403.63 m^2
Количество этажей: 2
Количество помещений: 9
Количество дверей: 8
Количество человек в здании: 80.73 чел.
---------------------------------------
Количество человек в здании: 0.00 чел.
Количество человек в безопасной зоне: 80.73 чел.
Длительность эвакуации: 308.40 с., 5.14 мин.
---------------------------------------
```

