"use client";

import axios from "axios";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Input, Tab, Tabs } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import React from "react";
import { apiClient } from "@/lib";
import { ADMIN_API_ROUTES } from "@/utils";
import { ScrapingQueue } from "@/components/admin/scraping-queue";
import { CurrentlyScrapingTable } from "./components/currently-scrapping-table";

type GeoNamesResponse = {
  geonames: { name: string }[];
};

const ScrapeData = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(
    undefined
  );
  const [jobs,setJobs] = useState([])

  const searchCities = async (searchString: string) => {
    if (!searchString) {
      setCities([]); // Clear cities if input is empty
      return;
    }
    try {
      const response = await axios.get<GeoNamesResponse>(
        `https://secure.geonames.org/searchJSON?q=${searchString}&maxRows=5&username=parth0102&style=SHORT`
      );

      const uniqueCities = Array.from(
        new Set(response.data.geonames.map((city) => city.name))
      );
      setCities(uniqueCities); // Set only unique city names
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    }
  };

  const startScraping = async () => {
    if (!selectedCity) {
      console.error("No city selected");
      return;
    }
    try {
      await apiClient.post(ADMIN_API_ROUTES.CREATE_JOBS, {
        url:
          "https://packages.yatra.com/holidays/intl/search.htm?destination=" +
          selectedCity,
        jobType: { type: "location" },
      });
      console.log(`Job created for scraping ${selectedCity}`);
    } catch (error) {
      console.error("Error starting scraping job:", error);
    }
  };

  useEffect(() => {
      const getData = async () => {
        const data = await apiClient.get(ADMIN_API_ROUTES.JOB_DETAILS);
  
        setJobs(data.data.jobs);
      };
      const interval = setInterval(() => getData(), 3000);
  
      return () => {
        clearInterval(interval);
      };
    }, []);

  return (
    <section className="m-10 grid grid-cols-3 gap-5">
      <Card className="col-span-2">
        <CardBody>
          <Tabs>
            <Tab key="location" title="Location">
              <Input
                type="text"
                label="Search for a location"
                onChange={(e) => searchCities(e.target.value)}
              />
              <div className="w-full min-h-[200px] max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 mt-5">
                <Listbox
                  aria-label="Actions"
                  onAction={(key) => setSelectedCity(key as string)} 
                >
                  {cities.map((city) => (
                    <ListboxItem
                      key={city}
                      textValue={city}
                      color="primary"
                      className="text-primary-500"
                    >
                      {city}
                    </ListboxItem>
                  ))}
                </Listbox>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
        <CardFooter className="flex flex-col gap-5">
          <div>
            {selectedCity && (
              <h1 className="text-xl">Scrape data for {selectedCity}</h1>
            )}
          </div>
          <Button
            size="lg"
            className="w-full"
            color="primary"
            onClick={startScraping}
          >
            Scrape
          </Button>
        </CardFooter>
      </Card>
      <ScrapingQueue />
      <div className="col-span-3">
       <CurrentlyScrapingTable jobs={jobs} />
      </div>
    </section>
  );
};

export default ScrapeData;
