# scrape data from https://en.wikipedia.org/wiki/List_of_Olympic_medalists_in_speed_skating

library(rvest)
library(rjson)

URL <- "https://en.wikipedia.org/wiki/List_of_Olympic_medalists_in_speed_skating"

# get data
data <- read_html(URL)

# get all tables
tables <- data %>% html_nodes("table[class = 'wikitable plainrowheaders']")

disciplines <- c("500m","1000m", "1500m", "5000m", "10000m","3000m", "Team pursuit") #,"Mass start")

editions <- list(list(edition = 1924, city = "Chamonix", cityContinent = "Europe"),
                 list(edition = 1928, city = "St. Moritz", cityContinent = "Europe"),
                 list(edition = 1932, city = "Lake Placid", cityContinent = "Americas"),
                 list(edition = 1936, city = "Garmisch-Partenkirchen", cityContinent = "none"),
                 #list(edition = 1940, city = "none", cityContinent = "none"),
                 #list(edition = 1944, city = "none", cityContinent = "Europe"),
                 list(edition = 1948, city = "St. Moritz", cityContinent = "Europe"),
                 list(edition = 1952, city = "Oslo", cityContinent = "Europe"),
                 list(edition = 1956, city = "Cortina d'Ampezzo", cityContinent = "Europe"),
                 list(edition = 1960, city = "Squaw Valley", cityContinent = "Americas"),
                 list(edition = 1964, city = "Innsbruck", cityContinent = "Europe"),
                 list(edition = 1968, city = "Grenoble", cityContinent = "Europe"),
                 list(edition = 1972, city = "Sapporo", cityContinent = "Europe"),
                 list(edition = 1976, city = "Innsbruck", cityContinent = "Europe"),
                 list(edition = 1980, city = "Lake Placid", cityContinent = "Americas"),
                 list(edition = 1984, city = "Sarajevo", cityContinent = "Europe"),
                 list(edition = 1988, city = "Calgary", cityContinent = "Americas"),
                 list(edition = 1992, city = "Albertville", cityContinent = "Europe"),
                 list(edition = 1994, city = "Lillehammer", cityContinent = "Europe"),
                 list(edition = 1998, city = "Nagano", cityContinent = "Asia"),
                 list(edition = 2002, city = "Salt Lake City", cityContinent = "Americas"),
                 list(edition = 2006, city = "Turin", cityContinent = "Europe"),
                 list(edition = 2010, city = "Vancouver", cityContinent = "Americas"),
                 list(edition = 2014, city = "Sochi", cityContinent = "Asia"),
                 list(edition = 2018, city = "Pyeongchang", cityContinent = "Asia"))

result <- list()
# each table is a discipline
for (discipline in disciplines){
  
  # Initialize table and start edition for male/female
  editionCounter <- 0
  editionCounterF <- 0
  table <- NULL
  tablef <- NULL
  if(discipline == "500m"){
    table <- tables[1]
    tablef <- tables[8]
    editionCounterF <- 7
  }else if(discipline == "1000m"){
    table <- tables[2]
    tablef <- tables[9]
    editionCounter <- 11
    editionCounterF <- 7
  }else if(discipline == "1500m"){
    table <- tables[3]
    tablef <- tables[10]
    editionCounterF <- 7
  }else if(discipline == "3000m"){
    editionCounter <- 23
    editionCounterF <- 7
    tablef <- tables[11]
  }else if(discipline == "5000m"){
    table <- tables[4]
    tablef <- tables[12]
    editionCounterF <- 14
  }else if(discipline == "10000m"){
    table <- tables[5]
    editionCounterF <- 23
  }else if(discipline == "Team pursuit"){
    table <- tables[7]
    tablef <- tables[14]
    editionCounter <- 19
    editionCounterF <- 19
  }else if(discipline == "Mass start"){
    editionCounter <- 23
    editionCounterF <- 23
  }
  
  # init result for this discipline
  disciplineData <- list(group = discipline, editions = editions)
  
  # add male medals
  if(editionCounter > 0){
    for(k in 1:editionCounter){
      disciplineData$editions[[k]]$male <- list()
    }
  }
  
  if(!is.null(table)){
    tableRows <- table %>% html_nodes("tr")
    # each row is (part of) an edition
    for(i in 2:length(tableRows)){
      row <- tableRows[i]
      tds <- row %>% html_nodes("td")
      event <- tds[1] %>% html_node("a") %>% html_text()
      
      # normal row
      if(length(tds) == 4){
        editionCounter <- editionCounter + 1
        medals <- list()
        for(j in 2:length(tds)){
          cellContent <- tds[j]
          nameCity <- cellContent %>% html_nodes("a") %>% html_text()
          res <- list(pos = j-1, names = list(nameCity[1]), con = "Europe", country = nameCity[2]) # the continent is not available in the data, set it manually later if it isn't europe
          medals <- append(medals, list(res))
        }
        disciplineData$editions[[editionCounter]]$male <- medals
      } else if(length(tds) == 2 && discipline == "10000m"){
        editionCounter <- editionCounter + 1
        disciplineData$editions[[editionCounter]]$male <- list()
      }
    }
  }
  
  # Female medals
  if(editionCounterF > 0){
    for(k in 1:editionCounterF){
      disciplineData$editions[[k]]$female <- list()
    }
  }
  
  if(!is.null(tablef)){
    femaleTableRows <- tablef %>% html_nodes("tr")
    for(i in 2:length(femaleTableRows)){
      row <- femaleTableRows[i]
      tds <- row %>% html_nodes("td")
      event <- tds[1] %>% html_node("a") %>% html_text()
      
      # normal row
      if(length(tds) == 4){
        editionCounterF <- editionCounterF + 1
        medals <- list()
        for(j in 2:length(tds)){
          cellContent <- tds[j]
          nameCity <- cellContent %>% html_nodes("a") %>% html_text()
          res <- list(pos = j-1, names = list(nameCity[1]), con = "Europe", country = nameCity[2]) # the continent is not available in the data, set it manually later if it isn't europe
          medals <- append(medals, list(res))
        }
        disciplineData$editions[[editionCounterF]]$female <- medals
      } else if(length(tds) == 2 && discipline == "10000m"){
        editionCounterF <- editionCounterF + 1
        disciplineData$editions[[editionCounterF]]$female <- list()
      }
    }
  }
  
  result <- append(result, list(disciplineData))
}

# group_500m_medals <- list(pos = 1, names = list("Ger Inberg", con = "Americas", country = "NL"))
# group_500m_editions <- list(edition = 1024, city = "", cityContinent = "eru", male = group_500m_medals)
# group_500m <- list(group = "500m", editions = group_500m_editions)

json <- toJSON(result) 
write(json, "data/medals.json")