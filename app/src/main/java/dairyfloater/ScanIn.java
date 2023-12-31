package dairyfloater;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.Scanner;

public class ScanIn {

    public int amountEmployees(String schedule) {
        String remainSchedule = "";
        remainSchedule = schedule;
        int locationP = 0;
        int employees = 0;
        while (remainSchedule.length() > 0) {
            locationP = remainSchedule.indexOf(".");
            if (locationP != -1) {
                employees++;
                remainSchedule = remainSchedule.substring(locationP + 1);
            } else {
                employees++;
                remainSchedule = "";
            }
        }
        return employees;
    }

    public boolean firstCharSpace(String employeeStrings) {
        return employeeStrings.substring(0, 1).equals(" ");
    }

    public String[] createArray(String schedule) {
        String[] employeeArray = new String[amountEmployees(schedule)];
        String remainSchedule = schedule;
        int x = 0;
        while (remainSchedule.contains(".")) {
            employeeArray[x] = remainSchedule.substring(0, remainSchedule.indexOf(".") + 1);
            remainSchedule = remainSchedule.substring(remainSchedule.indexOf(".") + 1);
            x++;
        }
        return employeeArray;
    }

    public static String processString(String schedule) {
        schedule = schedule.trim();

        // Replace <br> or <br/> with an empty string
        schedule = schedule.replaceAll("(?i)<br\\s*/?>", "");

        // If the line still contains <br>, split it into multiple lines
        if (schedule.contains("<br>")) {
            String[] parts = schedule.split("<br>");
            schedule = String.join("", parts);
        }

        return schedule;
    }

    public Employee[] createEmployees(String[] employeeStrings) {
        Employee[] employees = new Employee[employeeStrings.length - 1];
        for (int x = 0; x < employees.length; x++) {
            String name = employeeStrings[x].substring(0, employeeStrings[x].indexOf(","));

            employeeStrings[x] = employeeStrings[x].substring(employeeStrings[x].indexOf(",") + 1);

            String position = employeeStrings[x].substring(0, employeeStrings[x].indexOf(","));

            employeeStrings[x] = employeeStrings[x].substring(employeeStrings[x].indexOf(",") + 1);

            int shiftStart = Integer.parseInt(employeeStrings[x].substring(0, employeeStrings[x].indexOf("-")));

            if (shiftStart < 8) {
                shiftStart += 12;
            }
            int shiftEnd = Integer.parseInt(
                    employeeStrings[x].substring(employeeStrings[x].indexOf("-") + 1, employeeStrings[x].indexOf(".")));
            if (shiftEnd < 10) {
                shiftEnd += 12;
            }

            employees[x] = new Employee(name, position, shiftStart, shiftEnd);
        }
        return employees;
    }

    public Employee[] createEmployees2(String schedule) {
        String[] employeeStrings = createArray(schedule);
        Employee[] employees = new Employee[employeeStrings.length];
        for (int x = 0; x < employees.length; x++) {
            String name = employeeStrings[x].substring(0, employeeStrings[x].indexOf(","));

            employeeStrings[x] = employeeStrings[x].substring(employeeStrings[x].indexOf(",") + 1);

            String position = employeeStrings[x].substring(0, employeeStrings[x].indexOf(","));

            employeeStrings[x] = employeeStrings[x].substring(employeeStrings[x].indexOf(",") + 1);

            int shiftStart = Integer.parseInt(employeeStrings[x].substring(0, employeeStrings[x].indexOf("-")));

            if (shiftStart < 8) {
                shiftStart += 12;
            }
            int shiftEnd = Integer.parseInt(
                    employeeStrings[x].substring(employeeStrings[x].indexOf("-") + 1, employeeStrings[x].indexOf(".")));
            if (shiftEnd < 10) {
                shiftEnd += 12;
            }

            employees[x] = new Employee(name, position, shiftStart, shiftEnd);
        }
        return employees;
    }

    public String[] readInRotations(int linesInput) {
        boolean floaters = false;
        String file = "/Users/alex/Desktop/Dairy-Floater-Program/app/src/main/resources/txt/output.txt";

        try {

            Scanner s = new Scanner(new File(file));

            boolean started = false;
            String[] lineNames = new String[0];
            String[] rotations = new String[0];

            while (s.hasNextLine()) {
                String line = s.nextLine();
                if (line.contains("Floaters:")) {
                    floaters = true;
                }
            }

            if (floaters) {
                if (linesInput == 1) {
                    lineNames = new String[] { "Walk-ups", "Floaters" };
                } else if (linesInput == 2) {
                    lineNames = new String[] { "Walk-ups", "Driveway", "Floaters" };
                } else if (linesInput == 3) {
                    lineNames = new String[] { "Walk-ups", "Driveway", "Curb", "Floaters" };
                }
                rotations = new String[(linesInput + 1)];

            } else {
                if (linesInput == 1) {
                    lineNames = new String[] { "Walk-ups" };
                } else if (linesInput == 2) {
                    lineNames = new String[] { "Walk-ups", "Driveway" };
                } else if (linesInput == 3) {
                    lineNames = new String[] { "Walk-ups", "Driveway", "Curb" };
                }
                rotations = new String[linesInput];
            }       

            Scanner[] scanners = new Scanner[rotations.length];

            for (int x = 0; x < rotations.length; x++) {
                scanners[x] = new Scanner(new File(file));
                while (scanners[x].hasNextLine()) {
                    String line = scanners[x].nextLine();
                    if (line.contains(lineNames[x])) {
                        rotations[x] = lineNames[x] + "<br>";
                        started = true;
                        continue;

                    }
                    if (x < lineNames.length - 1) {
                        if (line.contains(lineNames[x + 1])) {
                            started = false;
                            break;
                        }
                      
                    }

                    if (started) {
                        rotations[x] += line + "<br>";
                    }

                }
                scanners[x].close();
            }

            s.close();
            return rotations;
        } catch (IOException ex) {
            String[] error = { "Error", "Error", "Error", "Error" };

            ex.printStackTrace();

            return error;
        }
    }

}
